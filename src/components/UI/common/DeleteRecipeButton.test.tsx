// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const { deleteRecipe, refresh, success, error } = vi.hoisted(() => ({
  deleteRecipe: vi.fn(),
  refresh: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}))
vi.mock('@/actions/recipe/delete-recipe', () => ({ deleteRecipe }))
vi.mock('@/actions/recipe/create-recipe', () => ({ createRecipe: vi.fn() }))
vi.mock('@/actions/recipe/update-recipe', () => ({ updateRecipe: vi.fn() }))
vi.mock('@/actions/recipe/get-recipes', () => ({ getRecipes: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }))
vi.mock('sonner', () => ({ toast: { success, error } }))

import { useRecipeStore } from '@/store/use-recipe-store'
import { DeleteRecipeButton } from './DeleteRecipeButton'

afterEach(cleanup)
beforeEach(() => {
  useRecipeStore.getState().reset()
  useRecipeStore.setState({
    recipes: [
      {
        id: 'recipe-a',
        name: 'Ramen',
        description: 'Noodles with broth',
        imageUrl: null,
        authorId: 'user-a',
        createdAt: new Date(),
        ingredients: [],
      },
    ],
  })
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

it('keeps the recipe and shows an error when deletion is refused', async () => {
  deleteRecipe.mockResolvedValue({ error: 'Access denied' })
  render(<DeleteRecipeButton recipeId="recipe-a" />)
  await userEvent.setup().click(screen.getByRole('button', { name: 'Delete' }))
  await waitFor(() => expect(error).toHaveBeenCalledWith('Access denied'))
  expect(success).not.toHaveBeenCalled()
  expect(refresh).not.toHaveBeenCalled()
  expect(useRecipeStore.getState().recipes).toHaveLength(1)
  expect(useRecipeStore.getState().isLoading).toBe(false)
})

it('reports a network failure without removing the recipe', async () => {
  deleteRecipe.mockRejectedValue(new Error('Network failed'))
  render(<DeleteRecipeButton recipeId="recipe-a" />)
  await userEvent.setup().click(screen.getByRole('button', { name: 'Delete' }))
  await waitFor(() =>
    expect(error).toHaveBeenCalledWith('Error deleting recipe')
  )
  expect(success).not.toHaveBeenCalled()
  expect(useRecipeStore.getState().recipes).toHaveLength(1)
  expect(useRecipeStore.getState().isLoading).toBe(false)
})

it('removes the recipe and refreshes the page only after successful deletion', async () => {
  deleteRecipe.mockResolvedValue({ success: true })
  render(<DeleteRecipeButton recipeId="recipe-a" />)
  await userEvent.setup().click(screen.getByRole('button', { name: 'Delete' }))
  await waitFor(() =>
    expect(success).toHaveBeenCalledWith('The recipe was deleted')
  )
  expect(error).not.toHaveBeenCalled()
  expect(refresh).toHaveBeenCalledTimes(1)
  expect(useRecipeStore.getState().recipes).toHaveLength(0)
})
