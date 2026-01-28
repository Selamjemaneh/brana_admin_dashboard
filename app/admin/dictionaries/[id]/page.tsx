'use client'

import { mockDictionaries } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft, Edit2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/date-utils'

interface DictionaryDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DictionaryDetailPage({ params }: DictionaryDetailPageProps) {
  const { id } = await params
  const dictionary = mockDictionaries.find((d) => d._id === id)

  if (!dictionary) {
    notFound()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/admin/dictionaries" className="w-full sm:w-auto">
          <Button variant="ghost" className="gap-2 text-xs sm:text-sm w-full sm:w-auto">
            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
            Back to Dictionaries
          </Button>
        </Link>
        <Link href={`/admin/dictionaries/${id}/edit`} className="w-full sm:w-auto">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-xs sm:text-sm w-full sm:w-auto rounded-xl">
            <Edit2 className="w-4 h-4 flex-shrink-0" />
            Edit Dictionary
          </Button>
        </Link>
      </div>

      {/* Detail Card */}
      <Card className="border border-border">
        <CardHeader>
          <div className="space-y-4">
            <div>
              <CardTitle className="font-serif text-2xl sm:text-3xl mb-2">{dictionary.name}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-secondary/50 text-foreground">
                {dictionary.language_code}
              </span>
              {dictionary.is_premium && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/30">Premium</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metadata Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Dictionary ID</p>
              <p className="text-xs sm:text-sm text-foreground font-mono break-all">{dictionary._id}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Language Code</p>
              <p className="text-xs sm:text-sm text-foreground">{dictionary.language_code}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Date Added</p>
              <p className="text-xs sm:text-sm text-foreground">{formatDate(new Date(dictionary.created_at))}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Status</p>
              <p className="text-xs sm:text-sm text-foreground">{dictionary.is_premium ? 'Premium' : 'Free'}</p>
            </div>
          </div>

          {/* Cover Image Section */}
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-3">Cover Image</p>
            <div className="w-full aspect-video rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-secondary/20">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-2">📖</div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {dictionary.cover_image_url ? 'Cover image' : 'No cover image uploaded'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
