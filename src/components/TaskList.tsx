'use client'

import { Task } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function TaskList({ tasks }: { tasks: Task[] }) {
    const router = useRouter()
    const supabase = createClient()

    const toggleTask = async (task: Task) => {
        const { error } = await supabase
            .from('tasks')
            .update({ is_completed: !task.is_completed })
            .eq('id', task.id)

        if (error) {
            toast.error('Failed to update task')
        } else {
            router.refresh()
        }
    }

    const deleteTask = async (id: string) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id)

        if (error) {
            toast.error('Failed to delete task')
        } else {
            toast.success('Task deleted')
            router.refresh()
        }
    }

    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout" initial={false}>
                {tasks.map((task) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        layout
                        className="group"
                    >
                        <Card className={`
                            border-none shadow-sm hover:shadow-md transition-all duration-300
                            ${task.is_completed
                                ? 'bg-muted/40 dark:bg-muted/10 opacity-70'
                                : 'bg-card/80 dark:bg-card/40 backdrop-blur-sm hover:bg-card'}
                        `}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <Checkbox
                                    checked={task.is_completed}
                                    onCheckedChange={() => toggleTask(task)}
                                    className={`w-6 h-6 rounded-full border-2 transition-colors
                                        ${task.is_completed
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-muted-foreground/30 hover:border-primary/50'}
                                    `}
                                />
                                <span className={`flex-1 font-medium text-base transition-all duration-300
                                    ${task.is_completed
                                        ? 'line-through text-muted-foreground'
                                        : 'text-foreground'}
                                `}>
                                    {task.title}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteTask(task.id)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
            {tasks.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 rounded-3xl bg-muted/20 border border-dashed border-border"
                >
                    <div className="bg-background p-4 rounded-full shadow-sm ring-1 ring-border/50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.408v9.443c0 1.435.846 2.398 1.956 2.593 1.125.197 2.275.298 3.42.298 1.145 0 2.295-.101 3.42-.298 1.11-.195 1.956-1.158 1.956-2.593V6.408c0-1.435-.846-2.398-1.956-2.592.374-.03.748-.057 1.124-.08M10.5 8.25h3.75a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75H14.25" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">No tasks yet</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1">
                            Your dashboard is clear! Add a new task above to stay organized.
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
