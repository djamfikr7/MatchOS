"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { matchingService } from "@/services/matching.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MatchesPage() {
    const router = useRouter()
    const params = useParams()
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            loadMatches(params.id as string)
        }
    }, [params.id])

    const loadMatches = async (requestId: string) => {
        try {
            const result = await matchingService.findMatches(requestId)
            setData(result)
        } catch (error) {
            console.error("Failed to load matches:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center">Finding the best matches for you... 🐹</div>
    }

    if (!data) {
        return <div className="p-8 text-center">No matches found.</div>
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Potential Matches</h1>
                <Button variant="outline" onClick={() => router.back()}>Back to Dashboard</Button>
            </div>

            {/* Request Details */}
            <Card className="glass border-primary/20">
                <CardHeader>
                    <CardTitle>Request: {data.request.Title}</CardTitle>
                    <CardDescription>{data.request.Description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Location: {data.request.Location}</span>
                        <span>Budget: ${data.request.Budget}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Matches List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.matches.map((match: any) => (
                    <Card key={match.user.ID} className="glass hover:bg-accent/5 transition-all hover:scale-105 cursor-pointer relative overflow-hidden">
                        {/* Score Badge */}
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg z-10">
                            {(match.score * 100).toFixed(0)}% Match
                        </div>

                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                                    {match.user.Email[0].toUpperCase()}
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{match.user.Email}</CardTitle>
                                    <CardDescription className="capitalize">{match.user.Role}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {match.user.Skills && match.user.Skills.length > 0 && (
                                <div className="mb-4 flex flex-wrap gap-1">
                                    {match.user.Skills.map((skill: string) => (
                                        <span key={skill} className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-secondary-foreground">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600">
                                Connect
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
