'use client'
import { useState } from "react"
import { ChangeEvent } from "react"
import { OPTIONS_CATEGORY } from "@/constans/selectOptions"
import { UNIT_OPTIONS } from "@/constans/selectOptions"

interface IIngredientFormData {
  name: string,
  category: string,
  unit: string,
  pricePerUnit: number | null,
  description?: string
}

export function IngredietnForm() {
  const [formData, setFormData] = useState<IIngredientFormData>({
    name: '',
    category: '',
    unit: '',
    pricePerUnit: null,
    description: ''
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('form submitted:',formData)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pricePerUnit' ? (value ? parseFloat(value) : null) : value
    }));
  };

  return (
    <div className="min-w-84.25 mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-black mb-6 border-b-2 border-orange-500 pb-2">
        New Ingredient
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-black mb-1">Ingredient Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Banana"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            >
              <option value="">Select</option>
              {OPTIONS_CATEGORY.map(category =>
                <option key={category.value} value={category.value}>{category.label}</option>

              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1">Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            >
              <option value="">Select</option>
              {UNIT_OPTIONS.map(unit =>
                <option key={unit.value} value={unit.value}>{unit.label}</option>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-1">Price per Unit</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              name="pricePerUnit"
              value={formData.pricePerUnit || ''}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 text-black outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            placeholder="Brief details about the ingredient..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white font-bold py-3 rounded-md hover:bg-orange-600 shadow-md uppercase tracking-wider text-sm duration-500 transition-colors"
        >
          Add Ingredient
        </button>
      </form>
    </div>
  );
}