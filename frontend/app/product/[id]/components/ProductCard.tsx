"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })

    toast({
      title: "Savatga qo'shildi",
      description: `1 ta ${product.name} savatga qo'shildi`,
    })
  }

  return (
    <Card
      className="min-w-[250px] max-w-[250px] cursor-pointer transition-all duration-300 hover:shadow-lg border-neutral-200/60 bg-white/95 backdrop-blur-sm overflow-hidden group"
      onClick={() => onClick(product)}
    >
      <div
        className="h-48 overflow-hidden cursor-pointer relative"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onClick(product)
        }}
      >
        <img
          src={product.image || "/placeholder.svg?height=200&width=300&query=food"}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-lg font-medium text-neutral-800 leading-snug">{product.name}</CardTitle>
      </CardHeader>
      <CardFooter className="p-5 pt-0 flex justify-between items-center">
        <p className="font-semibold text-neutral-700 text-lg">{product.price.toLocaleString()} so'm</p>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddToCart}
          className="border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400 transition-all duration-200 bg-transparent"
        >
          <Plus className="h-4 w-4 text-neutral-600" />
        </Button>
      </CardFooter>
    </Card>
  )
}
