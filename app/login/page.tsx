'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { login } from '../state/slice/authSlice'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loading: isLoading, error } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const resultAction = await dispatch(login({ email, password }))

    if (login.fulfilled.match(resultAction)) {
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      })
      router.push('/admin')
    } else {
      toast({
        title: 'Error',
        description: (resultAction.payload as string) || 'Invalid credentials',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/5 px-4 py-6 relative overflow-hidden">

      <Card className="w-full max-w-md shadow-2xl border border-accent/30 rounded-2xl relative z-10 overflow-hidden bg-card/98 backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <CardHeader className="space-y-3 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent">
              <div className="text-4xl font-serif text-white">⚓</div>
            </div>
          </div>
          <CardTitle className="font-serif text-3xl sm:text-4xl text-primary">Brana Gospel Admin</CardTitle>
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
        </CardContent>
      </Card>
    </div>
  )
}
