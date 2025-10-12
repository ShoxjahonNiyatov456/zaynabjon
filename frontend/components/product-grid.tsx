"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import AddToCartButton from "@/components/cart/AddToCartButton"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
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
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
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

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Hech qanday mahsulot topilmadi</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div
            className="relative cursor-pointer"
            onClick={() => window.location.href = `/product/${product._id}`}
          >
            <img
              src={product.image || "/placeholder.svg?height=200&width=300&query=food item"}
              alt={product.name}
              className="w-full h-48 object-cover transition-all duration-300 hover:scale-105 hover:brightness-90"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
          </div>
          <CardHeader>
            <CardTitle
              className="text-lg hover:text-primary cursor-pointer transition-colors"
              onClick={() => window.location.href = `/product/${product._id}`}
            >
              {product.name}
            </CardTitle>
            <CardDescription className="text-sm">{product.description}</CardDescription>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">{product.price.toLocaleString()} so'm</span>
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
