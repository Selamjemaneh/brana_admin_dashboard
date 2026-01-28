'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        })
        router.push('/admin')
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.message || 'Invalid credentials',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5 px-4 py-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 -mr-48 -mt-48" style={{background: '#d4af37'}} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-5 -ml-48 -mb-48" style={{background: '#1F2A37'}} />
      
      <Card className="w-full max-w-md shadow-2xl border border-accent/30 rounded-2xl relative z-10 overflow-hidden bg-card/98 backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <CardHeader className="space-y-3 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent">
              <div className="text-4xl font-serif text-white">⚓</div>
            </div>
          </div>
          <CardTitle className="font-serif text-3xl sm:text-4xl text-primary">Bible Admin</CardTitle>
          <CardDescription className="text-center text-xs sm:text-sm">
            Access your biblical resources management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground block">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-sm bg-secondary/50 border-border focus:ring-2 focus:ring-accent focus:border-transparent rounded-xl transition-all duration-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-foreground block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-sm bg-secondary/50 border-border focus:ring-2 focus:ring-accent focus:border-transparent rounded-xl transition-all duration-300"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-sm sm:text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl font-medium py-2.5 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo: Use any email and password
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
