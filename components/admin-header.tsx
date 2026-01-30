'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'

interface AdminHeaderProps {
  userEmail: string
  onMenuClick?: () => void
}

export function AdminHeader({ userEmail, onMenuClick }: AdminHeaderProps) {
  return (
    <header className="border-b border-accent/20 bg-gradient-to-r from-card to-card px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-primary/10 transition-colors duration-200"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5 text-primary" />
        </Button>
        <div className="min-w-0">
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-primary transition-colors duration-300">
            Biblical Resources
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {userEmail}
          </p>
        </div>
      </div>

      <div className="ml-4">
        <ThemeToggle />
      </div>
    </header>
  )
}
