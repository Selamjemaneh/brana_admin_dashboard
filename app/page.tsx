'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated by checking for session cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          // User is authenticated, redirect to admin dashboard
          router.push('/admin')
        } else {
          // User is not authenticated, redirect to login
          router.push('/login')
        }
      } catch (error) {
        // Error checking auth, redirect to login as fallback
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  // Show a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse">
          <div className="text-4xl font-serif text-white">⚓</div>
        </div>
        <h1 className="font-serif text-2xl font-bold text-primary">Bible Admin</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
