"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import CartIcon from "@/components/cart/CartIcon"
import Link from "next/link"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-2xl font-bold text-primary">ElektronMenu</Link>
          </div>
          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <CartIcon />

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">
                Bosh sahifa
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">
                Menyu
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">
                Biz haqimizda
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors py-2">
                Aloqa
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
