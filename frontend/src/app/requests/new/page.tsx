"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createRequestSchema, CreateRequestData, requestService } from "@/services/request.service"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default function NewRequestPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateRequestData>({
        resolver: zodResolver(createRequestSchema),
    })

    const onSubmit = async (data: CreateRequestData) => {
        setIsLoading(true)
        setError(null)

        try {
            const user = authService.getCurrentUser()
            if (!user) {
                router.push("/login")
                return
            }

            await requestService.create({
                ...data,
                userId: user.id,
            })

            router.push("/dashboard")
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create request")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
            <Card className="w-full max-w-lg glass">
                <CardHeader>
                    <CardTitle>Create New Request</CardTitle>
                    <CardDescription>Describe what you need help with.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Need a plumber"
                                {...register("title")}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Describe the task in detail..."
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. New York, NY"
                                    {...register("location")}
                                />
                                {errors.location && (
                                    <p className="text-sm text-red-500">{errors.location.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget ($)</Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("budget")}
                                />
                                {errors.budget && (
                                    <p className="text-sm text-red-500">{errors.budget.message}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="ghost" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Request"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
