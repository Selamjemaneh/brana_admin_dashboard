'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Book, BookOpen, BookMarked, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/app/state/hooks'
import { logout } from '@/app/state/slice/authSlice'
import { useRouter } from 'next/navigation'

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: Book,
  },
  {
    href: '/admin/commentaries',
    label: 'Commentaries',
    icon: BookOpen,
  },
  {
    href: '/admin/dictionaries',
    label: 'Dictionaries',
    icon: BookMarked,
  },
]

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(logout())
    router.push('/login')
  }

  const sidebarClasses = cn(
    'w-64 bg-card border-r border-border flex flex-col transition-all duration-300',
    'fixed md:relative inset-y-0 left-0 z-50 md:z-0',
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Logo */}
        <div className="p-6 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-serif font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">⚓</div>
            <div>
              <h1 className="font-serif text-lg font-bold text-primary">Brana Gospel Admin</h1>
              <p className="text-xs text-muted-foreground">Resource Manager</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
                  'relative overflow-hidden group',
                  isActive
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg'
                    : 'text-foreground hover:bg-secondary/50 hover:text-primary'
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                <Icon className="w-5 h-5 flex-shrink-0 relative z-10" />
                <span className="font-medium text-sm relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-foreground hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
