"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ethers } from "ethers"
import { authService } from "@/services/auth.service"
import { requestService, Request } from "@/services/request.service"
import { Button } from "@/components/ui/button"
import { NeoCard } from "@/components/ui/card"
import PageTransition from "@/components/ui/page-transition"
import { motion } from "framer-motion"
import { useSocket } from "@/contexts/socket-context"
import { toast } from "sonner"
import { Plus, Search, Sparkles, Wallet, Shield, LogOut, Settings, TrendingUp, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    const router = useRouter()
    const { socket } = useSocket()
    const [user, setUser] = useState<any>(null)
    const [requests, setRequests] = useState<Request[]>([])
    const [loading, setLoading] = useState(true)

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
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        authService.logout()
        router.push("/")
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="neo-card p-8 animate-pulse">
                    <div className="h-8 w-32 bg-muted rounded-lg" />
                </div>
            </div>
        )
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <PageTransition className="container mx-auto p-6 md:p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
                    <p className="text-muted-foreground mt-1">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button variant="neo" onClick={() => router.push("/wallet")} className="gap-2">
                        <Wallet className="w-4 h-4" /> Wallet
                    </Button>
                    {user.role === 'admin' && (
                        <Button variant="neo" onClick={() => window.open('http://localhost:3006', '_blank')} className="gap-2">
                            <Shield className="w-4 h-4" /> Admin
                        </Button>
                    )}
                    <Button variant="neo" onClick={handleLogout} className="gap-2 text-destructive hover:text-destructive">
                        <LogOut className="w-4 h-4" /> Log out
                    </Button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: "Role", value: user.role, icon: Shield, color: "from-blue-500 to-cyan-500" },
                    { label: "Requests", value: requests.length, icon: TrendingUp, color: "from-primary to-accent" },
                    { label: "Credits", value: user.credits || 0, icon: Sparkles, color: "from-yellow-500 to-orange-500" },
                    { label: "Reputation", value: `${user.reputation_base || 50}%`, icon: Shield, color: "from-green-500 to-emerald-500" },
                ].map((stat, i) => (
                    <motion.div key={i} variants={item}>
                        <NeoCard className="!p-5 hover-lift">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold capitalize">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </NeoCard>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <NeoCard className="!p-4">
                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={() => router.push("/requests/new")}
                        className="gap-2"
                    >
                        <Plus className="w-4 h-4" /> Create Request
                    </Button>
                    <Button
                        variant="gradient"
                        onClick={async () => {
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
                        className="gap-2"
                    >
                        <Sparkles className="w-4 h-4" /> Mint Reputation NFT
                    </Button>
                </div>
            </NeoCard>

            {/* Requests Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Your Requests</h2>
                    <Button variant="ghost" onClick={loadRequests} className="gap-2">
                        <Search className="w-4 h-4" /> Refresh
                    </Button>
                </div>

                {loading ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <NeoCard key={i} className="animate-pulse">
                                <div className="h-6 w-3/4 bg-muted rounded mb-4" />
                                <div className="h-4 w-full bg-muted rounded mb-2" />
                                <div className="h-4 w-2/3 bg-muted rounded" />
                            </NeoCard>
                        ))}
                    </div>
                ) : requests.length === 0 ? (
                    <NeoCard variant="inset" className="text-center !py-12">
                        <div className="neo-fab mx-auto mb-4 opacity-50">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-muted-foreground mb-4">No requests found.</p>
                        <Button onClick={() => router.push("/requests/new")}>
                            Create your first request
                        </Button>
                    </NeoCard>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {requests.map((req) => (
                            <motion.div key={req.id} variants={item}>
                                <NeoCard className="h-full flex flex-col hover-lift group">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                                            {req.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                            {req.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm mb-4">
                                            <span className="flex items-center gap-1 font-semibold">
                                                <Wallet className="w-4 h-4 text-primary" />
                                                ${req.budget}
                                            </span>
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <MapPin className="w-4 h-4" />
                                                {typeof req.location === 'string' ? req.location : 'N/A'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className={`text-xs px-3 py-1 rounded-full ${req.status === 'OPEN'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-secondary text-muted-foreground'
                                                }`}>
                                                {req.status}
                                            </span>
                                            {req.campaign_status && (
                                                <span className={`text-xs px-3 py-1 rounded-full border ${req.campaign_status.status === 'ACTIVE'
                                                        ? 'border-purple-500/50 text-purple-400 bg-purple-500/10'
                                                        : req.campaign_status.status === 'FAILED'
                                                            ? 'border-red-500/50 text-red-400 bg-red-500/10'
                                                            : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                                                    }`}>
                                                    Campaign: {req.campaign_status.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={() => router.push(`/requests/${req.id}/matches`)}
                                            className="gap-1"
                                        >
                                            Find Matches <Search className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </NeoCard>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </PageTransition>
    )
}
