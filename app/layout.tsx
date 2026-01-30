import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Merriweather } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import StoreProvider from './state/StoreProvider'
import { Toaster } from "@/components/ui/sonner"
import './globals.css'

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });
const merriweather = Merriweather({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: 'Bible App Admin Dashboard',
  description: 'Manage biblical commentaries and dictionaries',
  generator: 'brana_admin_dashboard',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          storageKey="bible-admin-theme"
          forcedTheme={undefined}
        >
          <StoreProvider>
            {children}
          </StoreProvider>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
