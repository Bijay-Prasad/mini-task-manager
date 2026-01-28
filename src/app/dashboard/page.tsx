import { createClient } from '@/lib/supabase/server'
import { AddTask } from '@/components/AddTask'
import { TaskList } from '@/components/TaskList'
import { redirect } from 'next/navigation'
import { signout } from '../auth/actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = createClient()
    const { data: { user } } = await (await supabase).auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: tasks } = await (await supabase)
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-4xl mx-auto p-4 sm:p-8 relative z-10">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 backdrop-blur-sm bg-background/30 p-4 rounded-2xl border border-border/40">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            My Tasks
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Welcome back, <span className="text-foreground">{user.email?.split('@')[0]}</span>
                        </p>
                    </div>
                    <form action={signout}>
                        <Button variant="outline" type="submit" className="border-border/50 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </form>
                </header>

                <main className="space-y-8">
                    <section className="relative z-20">
                        <AddTask userId={user.id} />
                    </section>

                    <section className="rounded-3xl">
                        {/* @ts-ignore */}
                        <TaskList tasks={tasks || []} />
                    </section>
                </main>
            </div>
        </div>
    )
}
