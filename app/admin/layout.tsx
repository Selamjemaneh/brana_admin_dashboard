'use client'

import React, { useState } from "react"
import { AdminSidebar } from '@/components/admin-sidebar'
import { AdminHeader } from '@/components/admin-header'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/app/state/hooks'
import { logout } from '@/app/state/slice/authSlice'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, token } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const userEmail = user?.email || ''

  useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  if (!token) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader userEmail={userEmail} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 sm:p-6 md:p-8 max-w-12xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
