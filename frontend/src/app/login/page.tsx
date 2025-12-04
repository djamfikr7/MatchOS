"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { NeoCard } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import PageTransition from "@/components/ui/page-transition"
import { motion } from "framer-motion"
import { LogIn, Mail, Lock, Sparkles } from "lucide-react"

const formSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setError("")
        try {
            await authService.login(values.email, values.password)
            router.push("/dashboard")
        } catch (err) {
            setError("Invalid email or password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageTransition className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-12">
            {/* Background Effects */}
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/20 blur-[100px] rounded-full -z-10" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/15 blur-[120px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <NeoCard className="!p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="neo-fab mx-auto mb-4"
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold">Welcome Back</h1>
                        <p className="text-muted-foreground mt-1">Log in to your MatchOS account</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    {...field}
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    className="neo-input pl-11"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    {...field}
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="neo-input pl-11"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="neo-inset !p-3 bg-destructive/10 border border-destructive/20 rounded-xl"
                                >
                                    <p className="text-sm text-destructive text-center">{error}</p>
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4" /> Log in
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-border/50 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="text-primary font-medium hover:underline transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </NeoCard>

                {/* Demo Credentials */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                >
                    <NeoCard variant="inset" className="!p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-2">Demo credentials:</p>
                        <code className="text-xs bg-secondary px-2 py-1 rounded">
                            demo@matchos.io / password123
                        </code>
                    </NeoCard>
                </motion.div>
            </motion.div>
        </PageTransition>
    )
}
