"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const bannerImages = [
  {
    id: 1,
    src: "/delicious-food-banner.png",
    alt: "Delicious Food Banner",
    title: "Mazali Taomlar",
    description: "Eng yaxshi ingredientlardan tayyorlangan",
  },
  {
    id: 2,
    src: "/coffee-beans-banner.jpg",
    alt: "Coffee Beans Banner",
    title: "Aromat Qahva",
    description: "Har kuni yangi qovurilgan qahva donlari",
  },
  {
    id: 3,
    src: "/healthy-food-banner.jpg",
    alt: "Healthy Food Banner",
    title: "Sog'lom Ovqat",
    description: "Tabiiy va organik mahsulotlar",
  },
]

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  }

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {bannerImages.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
            }`}
        >
          <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">{image.title}</h2>
              <p className="text-xl">{image.description}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
