'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/date-utils'
import { getS3PublicUrl } from '@/lib/utils'
import { Star } from 'lucide-react'

interface ViewCommentaryDialogProps {
    commentary: any
    isOpen: boolean
    onClose: () => void
}

export function ViewCommentaryDialog({
    commentary,
    isOpen,
    onClose,
}: ViewCommentaryDialogProps) {
    if (!commentary) return null

    const imageUrl = getS3PublicUrl(commentary.cover_image_url)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">Commentary Details</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Cover Image */}
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-border bg-secondary/20 flex items-center justify-center">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={commentary.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-center">
                                <div className="text-4xl mb-2">📖</div>
                                <p className="text-sm text-muted-foreground">No cover image</p>
                            </div>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</p>
                            <p className="text-sm font-semibold text-foreground">{commentary.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Author</p>
                            <p className="text-sm font-medium text-foreground">{commentary.author || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Language</p>
                            <Badge variant="secondary" className="font-mono">{commentary.language_code}</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                            <div className="flex items-center gap-2">
                                {commentary.is_premium ? (
                                    <Badge className="bg-accent/10 text-accent border-accent/30 flex gap-1 items-center">
                                        <Star className="w-3 h-3 fill-accent" />
                                        Premium
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">Free</Badge>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Added On</p>
                            <p className="text-sm text-foreground">{formatDate(new Date(commentary.created_at))}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
