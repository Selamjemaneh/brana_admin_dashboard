'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { languageCodes } from '@/lib/mock-data'
import { Eye, Edit2, Star, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/date-utils'
import { useAppDispatch, useAppSelector } from '@/app/state/hooks'
import { fetchCommentaries } from '@/app/state/slice/commentarySlice'
import { useEffect } from 'react'
import { EditCommentaryDialog } from '@/app/admin/commentaries/edit/edit-commentary-dialog'
import { ViewCommentaryDialog } from '@/components/view-commentary-dialog'

export function CommentaryList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [editingCommentary, setEditingCommentary] = useState<any>(null)
  const [viewingCommentary, setViewingCommentary] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const dispatch = useAppDispatch()
  const { commentaries, loading, error } = useAppSelector((state) => state.commentary)

  useEffect(() => {
    dispatch(fetchCommentaries())
  }, [dispatch])

  const filteredCommentaries = useMemo(() => {
    return commentaries.filter((commentary) => {
      const matchesSearch =
        commentary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (commentary.author && commentary.author.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesLanguage = selectedLanguage === 'All' || commentary.language_code === selectedLanguage

      return matchesSearch && matchesLanguage
    })
  }, [searchQuery, selectedLanguage, commentaries])

  if (loading && commentaries.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="text-xs sm:text-sm font-medium text-foreground mb-2 block">
            Search by name or author
          </label>
          <Input
            placeholder="Search commentaries..."
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
                <TableHead className="flex-1 text-foreground text-xs sm:text-sm font-medium">Commentary Name</TableHead>
                <TableHead className="flex-1 text-foreground text-xs sm:text-sm font-medium">Author</TableHead>
                <TableHead className="flex-1 text-center text-foreground text-xs sm:text-sm font-medium">Language</TableHead>
                <TableHead className="flex-1 text-center text-foreground text-xs sm:text-sm font-medium">Premium</TableHead>
                <TableHead className="flex-1 text-center text-foreground text-xs sm:text-sm font-medium">Date Added</TableHead>
                <TableHead className="flex-1 text-center text-foreground text-xs sm:text-sm font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommentaries.length > 0 ? (
                filteredCommentaries.map((commentary) => (
                  <TableRow
                    key={commentary._id}
                    className="border-b border-border transition-all duration-200 hover:bg-primary/5"
                  >
                    <TableCell>
                      <div className="font-medium text-foreground text-xs sm:text-sm">{commentary.name}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs sm:text-sm">{commentary.author}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-secondary/50 text-foreground">
                        {commentary.language_code}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {commentary.is_premium ? (
                        <div className="flex items-center justify-center group cursor-help" title="Premium Content">
                          <Star className="w-5 h-5 text-[#FFD700] fill-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center group cursor-help opacity-40 hover:opacity-100 transition-opacity duration-300" title="Free Content">
                          <Star className="w-5 h-5 text-[#FFD700] border-[#FFD700]" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-xs sm:text-sm">
                      {formatDate(new Date(commentary.created_at))}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs sm:text-sm hover:bg-primary/10 h-8"
                          onClick={() => {
                            setViewingCommentary(commentary)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline ml-1">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs sm:text-sm hover:bg-primary/10 h-8"
                          onClick={() => {
                            setEditingCommentary(commentary)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline ml-1">Edit</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                    No commentaries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <EditCommentaryDialog
        commentary={editingCommentary}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setEditingCommentary(null)
        }}
      />

      <ViewCommentaryDialog
        commentary={viewingCommentary}
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false)
          setViewingCommentary(null)
        }}
      />
    </div>
  )
}
