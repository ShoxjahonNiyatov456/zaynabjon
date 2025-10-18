"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import AddToCartButton from "@/components/cart/AddToCartButton"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image?: string
  images?: string[]
  category: string
  available: boolean
}

interface ProductGridProps {
  products: Product[]
  loading: boolean
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden border-neutral-200/60 bg-white/95 backdrop-blur-sm">
            <Skeleton className="h-48 w-full" />
            <CardHeader className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg font-light">Hech qanday mahsulot topilmadi</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product._id}
          className="overflow-hidden border-neutral-200/60 bg-white/95 backdrop-blur-sm transition-all duration-300 hover:shadow-lg group"
        >
          <div
            className="relative cursor-pointer overflow-hidden"
            onClick={() => (window.location.href = `/product/${product._id}`)}
          >
            <img
              src={(product.images && product.images.length > 0) ? product.images[0].replace(/[` ]/g, '') : (product.image || "/placeholder.svg?height=200&width=300&query=food item")}
              alt={product.name}
              className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <CardHeader className="space-y-2">
            <CardTitle
              className="text-lg font-medium text-neutral-800 hover:text-neutral-600 cursor-pointer transition-colors leading-snug"
              onClick={() => (window.location.href = `/product/${product._id}`)}
            >
              {product.name}
            </CardTitle>
            <CardDescription className="text-sm text-neutral-600 font-light leading-relaxed">
              {product.description}
            </CardDescription>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xl font-semibold text-neutral-700">{product.price.toLocaleString()} so'm</span>
            </div>
          </CardHeader>

          <CardContent>
            <AddToCartButton product={product} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
