'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { mockDictionaries, languageCodes, type Dictionary } from '@/lib/mock-data'
import { Eye, Edit2, BookMarked, Star } from 'lucide-react'
import { formatDate } from '@/lib/date-utils'

export function DictionaryList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('All')

  const filteredDictionaries = useMemo(() => {
    return mockDictionaries.filter((dictionary) => {
      const matchesSearch = dictionary.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesLanguage = selectedLanguage === 'All' || dictionary.language_code === selectedLanguage

      return matchesSearch && matchesLanguage
    })
  }, [searchQuery, selectedLanguage])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">
            Search by name
          </label>
          <Input
            placeholder="Search dictionaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm bg-input border-border focus:ring-accent focus:border-accent"
          />
        </div>
        <div className="w-full lg:w-48">
          <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">
            Language
          </label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="text-sm bg-input border-border focus:ring-accent focus:border-accent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageCodes.map((code) => (
                <SelectItem key={code} value={code}>
                  {code === 'All' ? 'All Languages' : code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-secondary/30">
                <TableHead className="flex-1 text-foreground text-xs sm:text-sm font-medium">Dictionary Name</TableHead>
                <TableHead className="flex-1 text-center text-foreground text-xs sm:text-sm font-medium">Language</TableHead>
                <TableHead className="flex-1 text-center text-foreground text-xs sm:text-sm font-medium">Premium</TableHead>
                <TableHead className="flex-1 text-center text-foreground text-xs sm:text-sm font-medium">Date Added</TableHead>
                <TableHead className="flex-1 text-center text-foreground text-xs sm:text-sm font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDictionaries.length > 0 ? (
                filteredDictionaries.map((dictionary) => (
                  <TableRow 
                    key={dictionary._id} 
                    className="border-b border-border transition-all duration-200 hover:bg-primary/5"
                  >
                    <TableCell>
                      <div className="font-medium text-foreground text-xs sm:text-sm">{dictionary.name}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-secondary/50 text-foreground">
                        {dictionary.language_code}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {dictionary.is_premium ? (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mx-auto" title="Premium" />
                      ) : (
                        <Star className="w-5 h-5 text-white border border-border mx-auto" title="Free" />
                      )}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-xs sm:text-sm">
                      {formatDate(new Date(dictionary.created_at))}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <Link href={`/admin/dictionaries/${dictionary._id}`}>
                          <Button variant="ghost" size="sm" className="text-xs sm:text-sm hover:bg-primary/10 h-8">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline ml-1">View</span>
                          </Button>
                        </Link>
                        <Link href={`/admin/dictionaries/${dictionary._id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-xs sm:text-sm hover:bg-primary/10 h-8">
                            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline ml-1">Edit</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                    No dictionaries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
