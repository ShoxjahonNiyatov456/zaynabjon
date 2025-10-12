"use client"

import React, { memo } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'

interface MainLayoutProps {
  children: React.ReactNode
}

// Memo qo'llanilgan komponent - qayta render bo'lishni oldini oladi
const MainLayout = memo(({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
})

// displayName qo'shish - React DevTools uchun foydali
MainLayout.displayName = 'MainLayout'

export default MainLayout