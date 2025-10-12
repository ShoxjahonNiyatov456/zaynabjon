"use client"

import { useEffect, useState } from "react"
import { getSettings } from "@/lib/settingsApi"
import { MapPin, Phone, Instagram, Globe, MessageCircle } from "lucide-react"

export default function RestaurantBanner() {
  const [settings, setSettings] = useState({
    title: "",
    description: "",
    bannerUrl: "/delicious-food-banner.png",
    logo: "",
    phoneNumbers: [],
    location: "",
    instagram: "",
    telegram: "",
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings()
        setSettings({
          title: data.title || "",
          description: data.description || "",
          bannerUrl: data.banner || "/delicious-food-banner.png",
          logo: data.logo || "",
          phoneNumbers: data.phonenumbers,
          location: data.location || "",
        })
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image */}
      <img
        src={settings.bannerUrl || "/delicious-food-banner.png"}
        alt={settings.title || "Restaurant Banner"}
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content Container */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Section - Logo and Restaurant Info */}
            <div className="lg:col-span-7 flex flex-col lg:flex-row items-center lg:items-start gap-6">
              {/* Logo */}
              {settings.logo && (
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-4 border-white/20 shadow-2xl">
                    <img
                      src={settings.logo || "/placeholder.svg"}
                      alt="Restaurant Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Restaurant Name and Social Links */}
              <div className="text-center lg:text-left">
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-2 font-serif">Welcome!</h1>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{settings.title || "BigJoy"}</h2>
                <p className="text-lg text-white/90 mb-4">{settings.description || settings.title}</p>

                {/* Social Media Icons */}
                <div className="flex gap-3 justify-center lg:justify-start">
                  {settings.instagram && (
                    <a
                      href={settings.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center border border-white/30"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {settings.telegram && (
                    <a
                      href={settings.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center border border-white/30"
                    >
                      <Globe className="w-5 h-5 text-white" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section - Contact Info Cards */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Address Card */}
              {settings.location && (
                <div className="bg-emerald-700/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-emerald-600/50 hover:bg-emerald-700 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80 mb-1 font-medium">Address</p>
                      <p className="text-lg font-semibold text-white leading-tight">{settings.location}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Phone Card */}
              {settings.phoneNumbers && settings.phoneNumbers.length > 0 && (
                <div className="bg-emerald-700/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-emerald-600/50 hover:bg-emerald-700 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80 mb-1 font-medium">Phone</p>
                      <p className="text-lg font-semibold text-white leading-tight">
                        {Array.isArray(settings.phoneNumbers)
                          ? settings.phoneNumbers.join(", ")
                          : settings.phoneNumbers}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
