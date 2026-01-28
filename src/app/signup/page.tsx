'use client'

import { signup } from '../auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'

import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        const result = await signup(formData)
        setLoading(false)

        if (result?.error) {
            toast.error(result.error)
        } else if (result?.message) {
            toast.success(result.message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden bg-background">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[80px] animate-pulse" />

            <Card className="w-full max-w-[400px] shadow-2xl border-none bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 relative z-10 ring-1 ring-border/20">
                <CardHeader className="space-y-3 pb-8">
                    <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 shadow-lg shadow-primary/5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" x2="20" y1="8" y2="14" /><line x1="23" x2="17" y1="11" y2="11" /></svg>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">Create an account</CardTitle>
                    <CardDescription className="text-center text-muted-foreground font-medium">
                        Enter your details to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium ml-1">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="bg-background/40 border-border/40 focus:bg-background/80 transition-all h-11 focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium ml-1">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="bg-background/40 border-border/40 focus:bg-background/80 transition-all h-11 focus:ring-2 focus:ring-primary/20 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <Button className="w-full h-11 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl" type="submit" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    <span>Creating account...</span>
                                </div>
                            ) : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center pt-2 pb-8">
                    <p className="text-sm text-muted-foreground font-medium">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors ml-1 hover:underline underline-offset-4">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
