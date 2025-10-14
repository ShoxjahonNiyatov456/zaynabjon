"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, ProductFormData } from "../types"

interface ProductFormProps {
  initialData?: Product
  categories: { _id: string; name: string }[]
  loading: boolean
  onSubmit: (data: ProductFormData) => Promise<void>
  onCancel: () => void
  submitLabel: string
}

export function ProductForm({ initialData, categories, loading, onSubmit, onCancel, submitLabel }: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    price: initialData?.price ? initialData.price.toString() : "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    images: [],
  })

  // Initialize image previews with existing images if available
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.images?.length ? initialData.images : initialData?.imageUrl ? [initialData.imageUrl] : [],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string): void => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...selectedFiles],
      }))

      // Create preview URLs for the selected images
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
      setImagePreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const handleRemoveImage = (index: number) => {
    // Remove image from formData
    const updatedImages = [...formData.images]
    updatedImages.splice(index, 1)

    // Remove preview URL
    const updatedPreviews = [...imagePreviews]
    URL.revokeObjectURL(updatedPreviews[index]) // Clean up the URL object
    updatedPreviews.splice(index, 1)

    setFormData((prev) => ({ ...prev, images: updatedImages }))
    setImagePreviews(updatedPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload Section - Now at the top */}
      <div className="space-y-2">
        <Label htmlFor="images">Rasm</Label>
        <div className="relative border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] bg-muted/30 hover:bg-muted/50 transition-colors">
          <input
            type="file"
            id="images"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="hidden"
            disabled={loading}
          />
          <div className="text-center">
            <div className="mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto text-muted-foreground"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">Rasm yuklash</p>
            <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to select</p>
            <div className="mt-3">
              <span className="text-xs text-muted-foreground">
                {imagePreviews.length > 0 ? `${imagePreviews.length}/7 rasmlar` : "0/7 rasmlar"}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 cursor-pointer" onClick={() => fileInputRef.current?.click()}></div>
        </div>

        {/* Image previews */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md border border-border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-100"
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Nomi</Label>
        <Input
          id="name"
          name="name"
          placeholder="Mahsulot nomini kiriting"
          value={formData.name}
          onChange={handleInputChange}
          disabled={loading}
          required
        />
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Ta'rifi</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Mahsulot haqida ma'lumot"
          value={formData.description}
          onChange={handleInputChange}
          disabled={loading}
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Price Field */}
      <div className="space-y-2">
        <Label htmlFor="price">Narxi</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.price}
          onChange={handleInputChange}
          disabled={loading}
          required
        />
      </div>

      {/* Category Field */}
      <div className="space-y-2">
        <Label htmlFor="category">Kategoriya</Label>
        <Select value={formData.category} onValueChange={handleSelectChange} disabled={loading}>
          <SelectTrigger>
            <SelectValue placeholder="Kategoriyani tanlang" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Bekor qilish
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}