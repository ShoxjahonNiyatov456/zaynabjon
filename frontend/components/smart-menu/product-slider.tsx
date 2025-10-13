"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import AddToCartButton from "@/components/cart/AddToCartButton"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}

interface ProductSliderProps {
  products: Product[]
  loading: boolean
  onProductSelect: (product: Product) => void
  selectedProduct: Product | null
}

export default function ProductSlider({ products, loading, onProductSelect, selectedProduct }: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const scrollTo = direction === "left"
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2

      sliderRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth"
      })

      setScrollPosition(scrollTo)
    }
  }

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="min-w-[250px] max-w-[250px] flex-shrink-0">
            <Skeleton className="h-40 w-full rounded-t-lg" />
            <CardHeader className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">Bu kategoriyada mahsulotlar mavjud emas</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <Card
            key={product._id}
            className={`min-w-[250px] max-w-[250px] flex-shrink-0 transition-all duration-300 ${selectedProduct?._id === product._id
                ? "ring-2 ring-primary shadow-lg transform scale-[1.02]"
                : "hover:shadow-md"
              }`}
          >
            <div className="relative h-40 overflow-hidden rounded-t-lg">
              <img
                src={product.image || "/placeholder.svg?height=160&width=250&query=food"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>

            <CardHeader className="p-4">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription className="text-sm line-clamp-2">{product.description}</CardDescription>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-primary">{product.price.toLocaleString()} so'm</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-primary/10"
                  onClick={() => onProductSelect(product)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            {selectedProduct?._id === product._id && (
              <CardContent className="p-4 pt-0">
                <AddToCartButton product={product} />
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {products.length > 3 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-background shadow-md z-10"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-background shadow-md z-10"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  )
}