'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockDictionaries, languageCodes } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { notFound } from 'next/navigation'

interface DictionaryEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DictionaryEditPage({ params }: DictionaryEditPageProps) {
  const { id } = await params
  const dictionary = mockDictionaries.find((d) => d._id === id)

  if (!dictionary) {
    notFound()
  }

  return <DictionaryEditForm dictionary={dictionary} />
}

function DictionaryEditForm({ dictionary }: any) {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: dictionary.name,
    language_code: dictionary.language_code,
    is_premium: dictionary.is_premium,
  })
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmDialog(true)
  }

  const handleConfirmSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: 'Success',
        description: 'Dictionary updated successfully',
      })

      setShowConfirmDialog(false)
      router.push(`/admin/dictionaries/${dictionary._id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update dictionary',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Link href={`/admin/dictionaries/${dictionary._id}`}>
          <Button variant="ghost" className="gap-2 text-xs sm:text-sm">
            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
            Back to Dictionary
          </Button>
        </Link>
      </div>

      {/* Form Card */}
      <Card className="border border-border max-w-2xl">
        <CardHeader>
          <CardTitle className="font-serif text-xl sm:text-2xl">Edit Dictionary</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Update the dictionary information and metadata
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm font-medium text-foreground">
                Dictionary Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-sm bg-input border-border focus:ring-accent focus:border-accent rounded-xl"
                required
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language" className="text-xs sm:text-sm font-medium text-foreground">
                Language Code
              </Label>
              <Select
                value={formData.language_code}
                onValueChange={(value) => setFormData({ ...formData, language_code: value })}
              >
                <SelectTrigger className="text-sm bg-input border-border focus:ring-accent focus:border-accent rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageCodes.filter((code) => code !== 'All').map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Premium Toggle */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
              <Label htmlFor="premium" className="text-xs sm:text-sm font-medium text-foreground">
                Premium Content
              </Label>
              <Switch
                id="premium"
                checked={formData.is_premium}
                onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
              />
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-medium text-foreground">Cover Image</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-accent/50 transition-colors bg-secondary/10">
                <div className="text-3xl sm:text-4xl mb-2">🖼️</div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-6">
              <Button
                type="submit"
                disabled={isSaving}
                className="text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl w-full sm:w-auto"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href={`/admin/dictionaries/${dictionary._id}`} className="w-full sm:w-auto">
                <Button variant="outline" className="text-xs sm:text-sm border-border bg-transparent w-full rounded-xl">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="border border-border rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-lg sm:text-xl">Confirm Save</AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm">
              Are you sure you want to save the changes to {'"' + formData.name + '"'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <AlertDialogAction
              onClick={handleConfirmSave}
              disabled={isSaving}
              className="text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </AlertDialogAction>
            <AlertDialogCancel className="text-xs sm:text-sm border-border rounded-xl">
              Cancel
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
