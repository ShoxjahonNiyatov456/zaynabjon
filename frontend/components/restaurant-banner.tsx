"use client"

import { useEffect, useState } from "react"
import { getSettings } from "@/lib/settingsApi"
import { MapPin, Phone, Instagram, Globe } from "lucide-react"

export default function RestaurantBanner() {
  const [settings, setSettings] = useState({
    title: "",
    description: "",
    bannerUrl: "/delicious-food-banner.png",
    logo: "",
    phoneNumbers: [] as string[],
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
          instagram: data.socialMediaLinks?.instagram || "",
          telegram: data.socialMediaLinks?.telegram || ""
        })
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [])

  return (
    <div className="relative w-full h-[400px] lg:h-[450px] overflow-hidden bg-muted">
      {/* Background Image */}
      <img
        src={settings.bannerUrl || "/delicious-food-banner.png"}
        alt={settings.title || "Restaurant Banner"}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

      {/* Content Container */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center lg:items-start gap-6">
              {/* Logo */}
              {settings.logo && (
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-white/95 backdrop-blur-sm shadow-lg ring-1 ring-black/5">
                    <img
                      src={settings.logo || "/placeholder.svg"}
                      alt="Restaurant Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Restaurant Name and Description */}
              <div className="text-center lg:text-left space-y-3">
                <h1 className="text-4xl lg:text-5xl font-serif font-light text-white tracking-tight">
                  {settings.title || "BigJoy"}
                </h1>
                <p className="text-base lg:text-lg text-white/80 font-light leading-relaxed max-w-md">
                  {settings.description || "Discover exceptional dining"}
                </p>

                {(settings.instagram || settings.telegram) && (
                  <div className="flex gap-3 justify-center lg:justify-start pt-2">
                    {settings.instagram && (
                      <a
                        href={settings.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center justify-center border border-white/20"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-4 h-4 text-white" />
                      </a>
                    )}
                    {settings.telegram && (
                      <a
                        href={settings.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center justify-center border border-white/20"
                        aria-label="Telegram"
                      >
                        <Globe className="w-4 h-4 text-white" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:ml-auto lg:max-w-md">
              {/* Address */}
              {settings.location && (
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 shadow-lg border border-black/5 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Manzil</p>
                      <p className="text-sm font-medium text-foreground leading-relaxed">{settings.location}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Phone */}
              {settings.phoneNumbers && settings.phoneNumbers.length > 0 && (
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-5 shadow-lg border border-black/5 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Phone className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Telefon</p>
                      <p className="text-sm font-medium text-foreground leading-relaxed">
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
