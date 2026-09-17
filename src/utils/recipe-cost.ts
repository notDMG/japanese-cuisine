export interface RecipeCost {
  total: number
  isPartial: boolean
}

export function calculateRecipeCost(recipe: {
  ingredients: {
    quantity: number
    ingredient: { pricePerUnit: number | null }
  }[]
}): RecipeCost {
  let total = 0
  let isPartial: boolean = false

  for (const { quantity, ingredient } of recipe.ingredients) {
    if (ingredient.pricePerUnit == null) {
      isPartial = true
      continue
    }
    total += quantity * ingredient.pricePerUnit
  }

  return { total: Math.round(total * 100) / 100, isPartial }
}
