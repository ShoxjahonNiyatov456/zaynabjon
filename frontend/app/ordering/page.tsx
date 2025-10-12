"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Minus, Plus, X, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

// Google Maps konfiguratsiyasi
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem'
}

const defaultCenter = {
  lat: 41.2995,  // Toshkent markazi
  lng: 69.2401
}

export default function OrderPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart()
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(defaultCenter)
  const mapRef = useRef(null)
  const router = useRouter()
  const { toast } = useToast()

  // Google Maps API ni yuklash
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  })

  // Xaritada marker joylashuvini o'zgartirish
  const onMapClick = useCallback((e: any) => {
    setSelectedLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    })

    // Tanlangan joylashuv asosida manzilni yangilash
    fetchAddressFromCoordinates(e.latLng.lat(), e.latLng.lng())
  }, [])

  // Foydalanuvchining joriy joylashuvini aniqlash
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setSelectedLocation(currentLocation)
          fetchAddressFromCoordinates(currentLocation.lat, currentLocation.lng)
        },
        (error) => {
          console.error("Joylashuvni aniqlashda xatolik:", error)
          toast({
            title: "Xatolik",
            description: "Joylashuvni aniqlab bo'lmadi. Iltimos, xaritada qo'lda belgilang.",
            variant: "destructive",
          })
        }
      )
    } else {
      toast({
        title: "Xatolik",
        description: "Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.",
        variant: "destructive",
      })
    }
  }, [toast])

  // Koordinatalar asosida manzilni olish
  const fetchAddressFromCoordinates = async (lat: any, lng: any) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted_address)
      }
    } catch (error) {
      console.error("Manzilni olishda xatolik:", error)
    }
  }

  // Map obyektiga reference olish
  const onLoad = useCallback((map: any) => {
    mapRef.current = map
  }, [])

  const onUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast({
        title: "Savat bo'sh",
        description: "Iltimos, mahsulot qo'shing",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone,
          location: address,
          coordinates: {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng
          },
          products: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message)

      toast({
        title: "Buyurtma qabul qilindi",
        description: "Tez orada siz bilan bog'lanamiz",
      })

      clearCart()
      // Buyurtma muvaffaqiyatli bo'lgandan so'ng admin/orders sahifasiga yo'naltirish
      router.push("/admin/orders")
    } catch (error) {
      toast({
        title: "Xatolik",
        description: error instanceof Error ? error.message : "Qayta urinib ko'ring",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-balance">Buyurtma berish</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Section */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-xl font-semibold mb-6">Savat</h2>

            {items.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">Savatingiz bo'sh</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.price.toLocaleString()} so'm</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Jami</p>
                    <p className="text-2xl font-bold">{totalPrice.toLocaleString()} so'm</p>
                  </div>
                  <Button variant="outline" onClick={clearCart} disabled={items.length === 0}>
                    Tozalash
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Order Form */}
          <Card className="p-6 h-fit">
            <h2 className="text-xl font-semibold mb-6">Ma'lumotlar</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+998 XX XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Manzil</Label>
                <Input
                  id="address"
                  placeholder="Yetkazib berish manzili"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Xaritada belgilang
                </Label>
                {isLoaded ? (
                  <div className="rounded-md overflow-hidden border relative">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={selectedLocation}
                      zoom={13}
                      onClick={onMapClick}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                    >
                      <Marker position={selectedLocation} />
                    </GoogleMap>
                    <Button
                      type="button"
                      size="sm"
                      className="absolute top-2 right-2 bg-white text-black hover:bg-gray-100 shadow-md"
                      onClick={getCurrentLocation}
                    >
                      <MapPin className="h-4 w-4 mr-1" /> Turgan joyni aniqlash
                    </Button>
                  </div>
                ) : (
                  <div className="h-[300px] bg-muted flex items-center justify-center rounded-md">
                    <p>Xarita yuklanmoqda...</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Xaritada joylashuvni belgilash uchun bosing</p>
              </div>

              <Button type="submit" className="w-full" disabled={loading || items.length === 0}>
                {loading ? "Yuborilmoqda..." : "Buyurtma berish"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
