"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ethers } from "ethers"
import { authService } from "@/services/auth.service"
import { requestService, Request } from "@/services/request.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PageTransition from "@/components/ui/page-transition"
import { motion } from "framer-motion"
import { useSocket } from "@/contexts/socket-context"
import { toast } from "sonner"

export default function DashboardPage() {
    const router = useRouter()
    const { socket } = useSocket()
    const [user, setUser] = useState<any>(null)
    const [requests, setRequests] = useState<Request[]>([])

    useEffect(() => {
        const currentUser = authService.getCurrentUser()
        if (!currentUser) {
            router.push("/login")
        } else {
            setUser(currentUser)
            loadRequests()
        }
    }, [router])

    const loadRequests = async () => {
        try {
            const data = await requestService.getAll()
            setRequests(data)
        } catch (error) {
            console.error("Failed to load requests:", error)
        }
    }

    const handleLogout = () => {
        authService.logout()
        router.push("/")
    }

    if (!user) {
        return null
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <PageTransition className="container mx-auto p-8 space-y-8">
            {/* User Profile Section */}
            <Card className="glass">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Dashboard</CardTitle>
                            <CardDescription>Welcome back, {user.email}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20"
                                onClick={async () => {
                                    // Check for wallet connection
                                    if (typeof window !== "undefined" && (window as any).ethereum) {
                                        try {
                                            const provider = new ethers.BrowserProvider((window as any).ethereum)
                                            const accounts = await provider.listAccounts()
                                            if (accounts.length > 0) {
                                                toast.promise(authService.mintReputation(accounts[0].address), {
                                                    loading: 'Minting Reputation NFT...',
                                                    success: (data) => `Minted! TX: ${data.txHash.substring(0, 10)}...`,
                                                    error: 'Minting failed'
                                                });
                                            } else {
                                                toast.error("Please connect your wallet first!")
                                            }
                                        } catch (e) {
                                            toast.error("Wallet connection failed")
                                        }
                                    } else {
                                        toast.error("Metamask not found")
                                    }
                                }}
                            >
                                Mint Reputation 💎
                            </Button>
                            {user.role === 'admin' && (
                                <Button variant="outline" onClick={() => window.open('http://localhost:3007', '_blank')}>
                                    Admin Panel 🛡️
                                </Button>
                            )}
                            <Button variant="destructive" onClick={handleLogout}>
                                Log out
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="p-4 rounded-lg bg-secondary/50">
                            <div className="text-sm font-medium text-muted-foreground">Role</div>
                            <div className="text-2xl font-bold capitalize">{user.role}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/50">
                            <div className="text-sm font-medium text-muted-foreground">User ID</div>
                            <div className="text-xs font-mono mt-1 truncate" title={user.id}>{user.id}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Requests Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Your Requests</h2>
                    <Button onClick={() => router.push("/requests/new")}>Create Request</Button>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                    {requests.length === 0 ? (
                        <Card className="col-span-full bg-muted/50 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center h-40">
                                <p className="text-muted-foreground mb-4">No requests found.</p>
                                <Button variant="outline" onClick={() => router.push("/requests/new")}>
                                    Create your first request
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        requests.map((req) => (
                            <motion.div key={req.id} variants={item}>
                                <Card className="glass hover:bg-accent/5 transition-colors h-full flex flex-col justify-between">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{req.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{req.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold">${req.budget}</span>
                                            <span className="text-muted-foreground">{req.location}</span>
                                        </div>
                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="flex gap-2">
                                                <span className={`text-xs px-2 py-1 rounded-full ${req.status === 'OPEN' ? 'bg-green-500/20 text-green-400' : 'bg-secondary'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                                {req.campaign_status && (
                                                    <span className={`text-xs px-2 py-1 rounded-full border ${req.campaign_status.status === 'ACTIVE' ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' :
                                                            req.campaign_status.status === 'FAILED' ? 'border-red-500/50 text-red-400 bg-red-500/10' :
                                                                'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                                                        }`}>
                                                        Campaign: {req.campaign_status.status}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="mt-4">
                                            <Button
                                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                                                onClick={() => router.push(`/requests/${req.id}/matches`)}
                                            >
                                                Find Matches 🔍
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>
        </PageTransition>
    )
}
