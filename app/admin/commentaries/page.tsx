'use client'

import { CommentaryList } from '@/components/commentary-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function CommentariesPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Commentaries
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage biblical commentaries and their metadata
          </p>
        </div>
      </div>

      {/* Commentary List */}
      <CommentaryList />
    </div>
  )
}
