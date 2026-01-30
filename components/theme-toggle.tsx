'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'  
    setTheme(newTheme)
    // Force a re-render and update the document
    setTimeout(() => {
      console.log('[brana_admin_dashboard] After setTheme, current theme:', theme)
    }, 100)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-accent/15 group transition-all duration-300 rounded-full relative"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun 
          className="w-6 h-6 text-yellow-400 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" 
          aria-hidden="true"
        />
      ) : (
        <Moon 
          className="w-6 h-6 text-slate-600 transition-transform duration-300 group-hover:-rotate-45 group-hover:scale-110" 
          aria-hidden="true"
        />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
