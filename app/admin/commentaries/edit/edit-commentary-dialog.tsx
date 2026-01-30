'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { languageCodes } from '@/lib/mock-data'
import { useAppDispatch, useAppSelector } from '@/app/state/hooks'
import { updateCommentary, resetUpdating } from '@/app/state/slice/commentarySlice'
import { toast } from 'sonner'
import { Loader2, Upload, X, ImageIcon } from 'lucide-react'
import { cn, getS3PublicUrl } from '@/lib/utils'

interface EditCommentaryDialogProps {
    commentary: any
    isOpen: boolean
    onClose: () => void
}

export function EditCommentaryDialog({
    commentary,
    isOpen,
    onClose,
}: EditCommentaryDialogProps) {
    const dispatch = useAppDispatch()
    const { updating: isSaving } = useAppSelector((state) => state.commentary)

    const [formData, setFormData] = useState({
        name: '',
        author: '',
        language_code: '',
        is_premium: false,
    })
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (commentary) {
            dispatch(resetUpdating())
            setFormData({
                name: commentary.name || '',
                author: commentary.author || '',
                language_code: commentary.language_code || 'AM',
                is_premium: !!commentary.is_premium,
            })
            // Use existing cover image URL if available
            setImagePreview(getS3PublicUrl(commentary.cover_image_url) || null)
            setCoverImage(null)
        }
    }, [commentary, dispatch])

    const handleFileChange = (file: File) => {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            toast.error('Invalid file type: Please upload a PNG or JPG image.', { position: 'top-center' })
            return
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File too large: Image size must be less than 10MB.', { position: 'top-center' })
            return
        }

        setCoverImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        const formDataPayload = new FormData()
        formDataPayload.append('name', formData.name)
        formDataPayload.append('author', formData.author)
        formDataPayload.append('language_code', formData.language_code)
        formDataPayload.append('is_premium', (formData.is_premium as any))

        if (coverImage) {
            formDataPayload.append('cover_img', coverImage)
        } else if (imagePreview === null) {
            formDataPayload.append('cover_img', '') 
        }

        const resultAction = await dispatch(updateCommentary({
            id: commentary._id,
            data: formDataPayload
        }))

        if (updateCommentary.fulfilled.match(resultAction)) {
            toast.success("Commentary updated successfully", { position: "top-center" })
            onClose()
        } else {
            const errorMsg = (resultAction.payload as any) || 'Failed to update'
            toast.error(typeof errorMsg === 'string' ? errorMsg : "Commentary has not been updated", { position: "top-center" })
        }
    }


    if (!commentary) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                dispatch(resetUpdating())
                onClose()
            }
        }}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Commentary</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Commentary Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="author">Author</Label>
                        <Input
                            id="author"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="language">Language</Label>
                            <Select
                                value={formData.language_code}
                                onValueChange={(value) => setFormData({ ...formData, language_code: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languageCodes.filter(c => c !== 'All').map((code) => (
                                        <SelectItem key={code} value={code}>
                                            {code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-8">
                            <Label htmlFor="premium" className="cursor-pointer">
                                Premium Content
                            </Label>
                            <Switch
                                id="premium"
                                checked={formData.is_premium}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Cover Image</Label>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault()
                                setIsDragging(false)
                                const file = e.dataTransfer.files[0]
                                if (file) handleFileChange(file)
                            }}
                            className={cn(
                                "relative group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all duration-300",
                                isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 bg-secondary/20",
                                imagePreview ? "aspect-[16/9] overflow-hidden p-0" : "h-32"
                            )}
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="rounded-full"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setCoverImage(null)
                                                setImagePreview(null)
                                            }}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="text-xs font-medium text-foreground">Click or drag to upload</p>
                                    <p className="text-[10px] text-muted-foreground mt-1 text-center">
                                        PNG, JPG or JPEG (Max 10MB)
                                    </p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleFileChange(file)
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
