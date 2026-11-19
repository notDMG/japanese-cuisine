import { beforeEach, describe, expect, it, vi } from 'vitest'

const { auth, prisma, tx } = vi.hoisted(() => {
  const tx = {
    recipeIngredient: { deleteMany: vi.fn() },
    recipe: { delete: vi.fn() },
  }
  return {
    auth: vi.fn(),
    prisma: {
      ingredient: { count: vi.fn() },
      recipe: { create: vi.fn(), update: vi.fn(), findUnique: vi.fn() },
      $transaction: vi.fn(),
    },
    tx,
  }
})

vi.mock('@/auth/auth', () => ({ auth }))
vi.mock('@/utils/prisma', () => ({ prisma }))

import { createRecipe } from './create-recipe'
import { updateRecipe } from './update-recipe'
import { deleteRecipe } from './delete-recipe'

const input = {
  name: 'Ramen',
  description: 'Noodles with broth',
  imageUrl: 'https://example.com/ramen.jpg',
  ingredients: [{ ingredientId: 'own-ingredient', quantity: 2 }],
}

beforeEach(() => {
  vi.resetAllMocks()
  auth.mockResolvedValue({ user: { id: 'user-a' } })
  prisma.recipe.findUnique.mockResolvedValue({
    id: 'recipe-a',
    authorId: 'user-a',
  })

  prisma.ingredient.count.mockImplementation(({ where }) => {
    const ingredients = [
      { id: 'own-ingredient', authorId: 'user-a' },
      { id: 'foreign-ingredient', authorId: 'user-b' },
    ]
    return Promise.resolve(
      ingredients.filter(
        (item) =>
          where.id.in.includes(item.id) &&
          (where.authorId === undefined || item.authorId === where.authorId)
      ).length
    )
  })
  prisma.recipe.create.mockResolvedValue({ id: 'recipe-a', ...input })
  prisma.recipe.update.mockResolvedValue({ id: 'recipe-a', ...input })
  prisma.$transaction.mockImplementation((callback) => callback(tx))
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe.each([
  { name: 'createRecipe', run: (data: unknown) => createRecipe(data) },
  {
    name: 'updateRecipe',
    run: (data: unknown) => updateRecipe('recipe-a', data),
  },
])('$name ingredient authorization', ({ run }) => {
  it('accepts ingredients belonging to the signed-in user', async () => {
    expect(await run(input)).toMatchObject({ success: true })
  })

  it.each(['foreign-ingredient', 'missing-ingredient'])(
    'rejects %s before writing a recipe',
    async (ingredientId) => {
      const result = await run({
        ...input,
        ingredients: [...input.ingredients, { ingredientId, quantity: 1 }],
      })
      expect(result).toEqual({
        error: 'One or more ingredients are unavailable',
      })
      expect(prisma.recipe.create).not.toHaveBeenCalled()
      expect(prisma.recipe.update).not.toHaveBeenCalled()
    }
  )

  it('rejects unauthenticated requests without querying the database', async () => {
    auth.mockResolvedValue(null)
    expect(await run(input)).toHaveProperty('error')
    expect(prisma.ingredient.count).not.toHaveBeenCalled()
    expect(prisma.recipe.findUnique).not.toHaveBeenCalled()
    expect(prisma.recipe.create).not.toHaveBeenCalled()
    expect(prisma.recipe.update).not.toHaveBeenCalled()
  })

  it('returns a safe error if the ingredient lookup fails', async () => {
    prisma.ingredient.count.mockRejectedValue(new Error('Database unavailable'))
    expect(await run(input)).toHaveProperty('error')
    expect(prisma.recipe.create).not.toHaveBeenCalled()
    expect(prisma.recipe.update).not.toHaveBeenCalled()
  })
})

describe('recipe ownership', () => {
  it("rejects editing another user's recipe", async () => {
    prisma.recipe.findUnique.mockResolvedValue({
      id: 'recipe-a',
      authorId: 'user-b',
    })
    expect(await updateRecipe('recipe-a', input)).toHaveProperty('error')
    expect(prisma.recipe.update).not.toHaveBeenCalled()
  })

  it("rejects deleting another user's recipe", async () => {
    prisma.recipe.findUnique.mockResolvedValue({
      id: 'recipe-a',
      authorId: 'user-b',
    })
    expect(await deleteRecipe('recipe-a')).toHaveProperty('error')
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })
})

describe('deleteRecipe', () => {
  it('deletes links and the recipe through the same transaction', async () => {
    expect(await deleteRecipe('recipe-a')).toEqual({ success: true })
    expect(prisma.$transaction).toHaveBeenCalledTimes(1)
    expect(tx.recipeIngredient.deleteMany).toHaveBeenCalledWith({
      where: { recipeId: 'recipe-a' },
    })
    expect(tx.recipe.delete).toHaveBeenCalledWith({ where: { id: 'recipe-a' } })
    expect(
      tx.recipeIngredient.deleteMany.mock.invocationCallOrder[0]
    ).toBeLessThan(tx.recipe.delete.mock.invocationCallOrder[0])
  })

  it('propagates a failed write out of the transaction and reports an error', async () => {
    tx.recipe.delete.mockRejectedValue(new Error('Delete failed'))
    expect(await deleteRecipe('recipe-a')).toEqual({
      error: 'Failed to delete recipe',
    })
    await expect(prisma.$transaction.mock.results[0].value).rejects.toThrow(
      'Delete failed'
    )
  })

  it('handles a failed ownership lookup', async () => {
    prisma.recipe.findUnique.mockRejectedValue(
      new Error('Database unavailable')
    )
    expect(await deleteRecipe('recipe-a')).toEqual({
      error: 'Failed to delete recipe',
    })
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })
})
