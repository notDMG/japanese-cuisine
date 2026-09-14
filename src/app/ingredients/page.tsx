import { IngredientForm } from '@/components/forms/IngredientForm'
import { IngredientsList } from '@/components/UI/tables/IngredientsTable'

export default function IngredientPage() {
  return (
    <div>
      <IngredientForm />
      <IngredientsList />
    </div>
  )
}
