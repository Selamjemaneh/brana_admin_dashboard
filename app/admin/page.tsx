'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, BookMarked, Sparkles } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Commentaries',
      value: '24',
      description: 'Biblical commentaries available',
      icon: BookOpen,
      isHighlight: false,
    },
    {
      title: 'Total Dictionaries',
      value: '12',
      description: 'Biblical dictionaries in system',
      icon: BookMarked,
      isHighlight: true,
    },
    {
      title: 'Premium Resources',
      value: '8',
      description: 'Premium commentaries & dictionaries',
      icon: Sparkles,
      isHighlight: false,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome to the Bible App Admin Dashboard. Manage your biblical resources here.
        </p>
      </div>

      {/* Scripture Quote */}
      <Card className="border border-border bg-gradient-to-r from-primary/5 to-accent/5 hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6">
          <p className="text-sm sm:text-base italic text-muted-foreground leading-relaxed">
            {"\"All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.\" — 2 Timothy 3:16"}
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card 
              key={stat.title} 
              className={`border overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                stat.isHighlight 
                  ? 'bg-gradient-to-br from-accent/15 to-accent/5 border-accent/40' 
                  : 'bg-gradient-to-br from-primary/5 to-transparent border-border hover:border-accent/30'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -mr-16 -mt-16" style={{background: stat.isHighlight ? '#d4af37' : '#1F2A37'}} />
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                      {stat.title}
                    </CardTitle>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.isHighlight ? 'bg-accent/20' : 'bg-primary/10'}`}>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${
                      stat.isHighlight ? 'text-accent' : 'text-primary'
                    }`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="font-serif text-xl sm:text-2xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity yet. Start by adding commentaries or dictionaries.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
