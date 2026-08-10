import { IngredientsTable } from '@/components/UI/tables/IngredientsTable'
import { IngredientForm } from '@/components/forms/IngredientForm'

export default function Ingredients() {
  return (
    <div>
      <IngredientForm />
      <IngredientsTable />
    </div>
  )
}
