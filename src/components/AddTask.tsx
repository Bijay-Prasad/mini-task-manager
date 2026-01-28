'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner' // Import from sonner

export function AddTask({ userId }: { userId: string }) {
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setLoading(true)
        const { error } = await supabase.from('tasks').insert([{
            title,
            user_id: userId
        }])

        if (error) {
            toast.error('Failed to add task')
            console.error(error)
        } else {
            toast.success('Task added successfully')
            setTitle('')
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex gap-3 p-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/70 text-lg h-12"
                    disabled={loading}
                />
                <Button
                    type="submit"
                    disabled={loading || !title.trim()}
                    size="icon"
                    className="h-12 w-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                    <Plus className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>
        </form>
    )
}
