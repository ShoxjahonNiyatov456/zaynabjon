"use client"

import { useState, useEffect } from "react"
import ProductSlider from "./product-slider"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}

interface Category {
  _id: string
  name: string
  type: "main" | "salad" | "drink"
}

export default function SmartMenu() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Selected products by category type
  const [selectedMain, setSelectedMain] = useState<Product | null>(null)
  const [selectedSalad, setSelectedSalad] = useState<Product | null>(null)
  const [selectedDrink, setSelectedDrink] = useState<Product | null>(null)

  // Filtered products by category type
  const [mainDishes, setMainDishes] = useState<Product[]>([])
  const [salads, setSalads] = useState<Product[]>([])
  const [drinks, setDrinks] = useState<Product[]>([])

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      const data = await response.json()
      setProducts(data)

      // Filter products by category type
      const categoryMap = new Map<string, string>()

      // First, create a map of category IDs to their types
      const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      const categoriesData = await categoriesResponse.json()

      categoriesData.forEach((category: Category) => {
        categoryMap.set(category._id, category.type)
      })

      // Then filter products based on their category type
      const mains: Product[] = []
      const saladItems: Product[] = []
      const drinkItems: Product[] = []

      data.forEach((product: Product) => {
        const categoryType = categoryMap.get(product.category)
        if (categoryType === "main") mains.push(product)
        else if (categoryType === "salad") saladItems.push(product)
        else if (categoryType === "drink") drinkItems.push(product)
      })

      setMainDishes(mains)
      setSalads(saladItems)
      setDrinks(drinkItems)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }

  const handleProductSelect = (product: Product, categoryType: string) => {
    if (categoryType === "main") {
      setSelectedMain(product)
      setSelectedSalad(null) // Reset other selections
      setSelectedDrink(null)
    } else if (categoryType === "salad") {
      setSelectedSalad(product)
      setSelectedDrink(null) // Reset drink selection
      if (!selectedMain) setSelectedMain(null) // Only reset main if not already selected
    } else if (categoryType === "drink") {
      setSelectedDrink(product)
      setSelectedSalad(null) // Reset salad selection
      if (!selectedMain) setSelectedMain(null) // Only reset main if not already selected
    }
  }

  // Determine which sliders to show based on selections
  const showSaladSlider = selectedMain !== null
  const showDrinkSlider = selectedSalad !== null || (selectedDrink !== null && !selectedMain && !selectedSalad)
  const showMainSlider = selectedDrink !== null && !selectedMain && !selectedSalad

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Dishes Section - Always visible */}
      <section className="mb-8">
        <ProductSlider
          products={mainDishes}
          loading={loading}
          onProductSelect={(product: any) => handleProductSelect(product, "main")}
          selectedProduct={selectedMain}
        />
      </section>

      {/* Conditional Salad Slider */}
      {showSaladSlider && (
        <section className="mb-8 animate-fadeIn">
          <h3 className="text-xl font-semibold mb-4">Salatlar</h3>
          <ProductSlider
            products={salads}
            loading={loading}
            onProductSelect={(product: any) => handleProductSelect(product, "salad")}
            selectedProduct={selectedSalad}
          />
        </section>
      )}

      {/* Conditional Drink Slider */}
      {showDrinkSlider && (
        <section className="mb-8 animate-fadeIn">
          <h3 className="text-xl font-semibold mb-4">Ichimliklar</h3>
          <ProductSlider
            products={drinks}
            loading={loading}
            onProductSelect={(product: any) => handleProductSelect(product, "drink")}
            selectedProduct={selectedDrink}
          />
        </section>
      )}

      {/* Conditional Main Dish Slider (when drink is selected first) */}
      {showMainSlider && (
        <section className="mb-8 animate-fadeIn">
          <h3 className="text-xl font-semibold mb-4">Tavsiya etilgan taomlar</h3>
          <ProductSlider
            products={mainDishes}
            loading={loading}
            onProductSelect={(product: any) => handleProductSelect(product, "main")}
            selectedProduct={selectedMain}
          />
        </section>
      )}
    </div>
  )
}