'use client'

import { DictionaryList } from '@/components/dictionary-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function DictionariesPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Dictionaries
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage biblical dictionaries and their metadata
          </p>
        </div>
        <Link href="/admin/dictionaries/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl">
            <Plus className="w-4 h-4" />
            Add Dictionary
          </Button>
        </Link>
      </div>

      {/* Dictionary List */}
      <DictionaryList />
    </div>
  )
}
