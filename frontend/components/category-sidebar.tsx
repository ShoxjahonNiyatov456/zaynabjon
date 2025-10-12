"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Category {
  _id: string
  name: string
  description?: string
}

interface CategorySidebarProps {
  categories: Category[]
  selectedCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
}

export default function CategorySidebar({ categories, selectedCategory, onCategorySelect }: CategorySidebarProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kategoriyalar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          className="w-full justify-start"
          onClick={() => onCategorySelect(null)}
        >
          Barchasi
        </Button>

        {categories.map((category) => (
          <Button
            key={category._id}
            variant={selectedCategory === category._id ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => onCategorySelect(category._id)}
          >
            {category.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
