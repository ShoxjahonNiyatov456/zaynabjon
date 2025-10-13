"use client"

import { useState, useEffect } from "react"
import RestaurantBanner from "@/components/restaurant-banner"
import CategorySidebar from "@/components/category-sidebar"
import ProductGrid from "@/components/product-grid"
import Footer from "@/components/footer"
import Header from "@/components/header"
import SmartMenu from "@/components/smart-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MainLayout from "@/components/layouts/MainLayout"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("classic")

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
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products

  return (
    <MainLayout>
      <RestaurantBanner />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="classic" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="classic">Klassik ko'rinish</TabsTrigger>
            <TabsTrigger value="smart">Smart Menu</TabsTrigger>
          </TabsList>

          <TabsContent value="classic">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="lg:w-64">
                <CategorySidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                />
              </aside>

              <main className="flex-1">
                <ProductGrid products={filteredProducts} loading={loading} />
              </main>
            </div>
          </TabsContent>

          <TabsContent value="smart">
            <SmartMenu />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
