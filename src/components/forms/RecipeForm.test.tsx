// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { IRecipe } from '@/types/recipe'

const { addRecipe, updateRecipe, loadIngredients, push } = vi.hoisted(() => ({
  addRecipe: vi.fn(),
  updateRecipe: vi.fn(),
  loadIngredients: vi.fn(),
  push: vi.fn(),
}))

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/store/use-recipe-store', () => ({
  useRecipeStore: (selector: (state: unknown) => unknown) =>
    selector({ addRecipe, updateRecipe }),
}))
vi.mock('@/store/use-ingredient-store', () => ({
  useIngredientStore: (selector: (state: unknown) => unknown) =>
    selector({
      isLoading: false,
      ingredients: [{ id: 'ingredient-a', name: 'Noodles' }],
      loadIngredients,
    }),
}))

import RecipeForm from './RecipeForm'

afterEach(cleanup)
beforeEach(() => {
  addRecipe.mockResolvedValue({ success: true })
  updateRecipe.mockResolvedValue({ success: true })
})

describe('recipe image URL', () => {
  it('updates the preview while typing, retries after a failed image, and submits the new URL', async () => {
    const user = userEvent.setup()
    render(<RecipeForm />)
    const imageInput = screen.getByPlaceholderText(
      'https://example.com/image.jpg'
    )
    await user.type(imageInput, 'https://example.com/broken.jpg')
    expect(screen.getByAltText('Recipe preview').getAttribute('src')).toBe(
      'https://example.com/broken.jpg'
    )
    fireEvent.error(screen.getByAltText('Recipe preview'))
    expect(screen.queryByAltText('Recipe preview')).toBeNull()

    await user.clear(imageInput)
    await user.type(imageInput, 'https://example.com/ramen.jpg')
    expect(screen.getByAltText('Recipe preview').getAttribute('src')).toBe(
      'https://example.com/ramen.jpg'
    )

    await user.type(screen.getByPlaceholderText('Ramen'), 'Ramen')
    await user.type(
      screen.getByPlaceholderText('Add description...'),
      'Noodles with broth'
    )
    await user.selectOptions(screen.getByRole('combobox'), 'ingredient-a')
    await user.click(screen.getByRole('button', { name: 'Add Recipe' }))
    await waitFor(() =>
      expect(addRecipe).toHaveBeenCalledWith(
        expect.objectContaining({
          imageUrl: 'https://example.com/ramen.jpg',
        })
      )
    )
  })

  it('submits an empty URL when an existing image is removed', async () => {
    const user = userEvent.setup()
    const recipe: IRecipe = {
      id: 'recipe-a',
      name: 'Ramen',
      description: 'Noodles with broth',
      imageUrl: 'https://example.com/old.jpg',
      ingredients: [
        {
          id: 'link-a',
          recipeId: 'recipe-a',
          ingredientId: 'ingredient-a',
          quantity: 1,
          ingredient: {
            id: 'ingredient-a',
            name: 'Noodles',
            category: 'OTHER',
            unit: 'GRAMS',
            pricePerUnit: 1,
            description: null,
            authorId: 'user-a',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ],
    }
    render(<RecipeForm initialRecipe={recipe} />)
    await user.clear(
      screen.getByPlaceholderText('https://example.com/image.jpg')
    )
    expect(screen.queryByAltText('Recipe preview')).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))
    await waitFor(() =>
      expect(updateRecipe).toHaveBeenCalledWith(
        'recipe-a',
        expect.objectContaining({ imageUrl: '' })
      )
    )
  })
})
