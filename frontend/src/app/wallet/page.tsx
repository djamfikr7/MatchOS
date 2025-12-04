"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { NeoCard } from "@/components/ui/card"
import PageTransition from "@/components/ui/page-transition"
import { motion } from "framer-motion"
import { Wallet, CreditCard, Zap, Crown, Sparkles, ArrowRight, Check } from "lucide-react"

interface CreditBundle {
    id: string;
    name: string;
    credits: number;
    price_dzd: number;
    popular?: boolean;
    icon: any;
}

interface WalletBalance {
    credits: number;
    transactions: any[];
}

const BUNDLES: CreditBundle[] = [
    { id: 'starter', name: 'Starter', credits: 5, price_dzd: 500, icon: Zap },
    { id: 'standard', name: 'Standard', credits: 10, price_dzd: 1000, popular: true, icon: Sparkles },
    { id: 'premium', name: 'Premium', credits: 25, price_dzd: 2000, icon: Crown },
    { id: 'business', name: 'Business', credits: 100, price_dzd: 7000, icon: CreditCard },
]

export default function WalletPage() {
    const router = useRouter()
    const [balance, setBalance] = useState<WalletBalance | null>(null)
    const [bundles, setBundles] = useState<CreditBundle[]>(BUNDLES)
    const [loading, setLoading] = useState(true)
    const [purchasing, setPurchasing] = useState<string | null>(null)

    useEffect(() => {
        const user = authService.getCurrentUser()
        if (!user) {
            router.push("/login")
            return
        }

        // Fetch wallet data
        Promise.all([
            fetch("http://localhost:3001/wallet/balance", {
                headers: { Authorization: `Bearer ${authService.getToken()}` }
            }).then(r => r.ok ? r.json() : { credits: 0, transactions: [] }).catch(() => ({ credits: 0, transactions: [] })),
            fetch("http://localhost:3001/wallet/bundles").then(r => r.ok ? r.json() : BUNDLES).catch(() => BUNDLES)
        ]).then(([balanceData, bundlesData]) => {
            setBalance(balanceData)
            // Merge with icons
            setBundles(bundlesData.map((b: any, i: number) => ({ ...b, icon: BUNDLES[i]?.icon || Zap })))
            setLoading(false)
        })
    }, [router])

    const handlePurchase = async (bundleId: string) => {
        setPurchasing(bundleId)
        try {
            const response = await fetch("http://localhost:3001/wallet/purchase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify({
                    bundleId,
                    paymentMethod: "baridimob",
                    paymentReference: `SIM_${Date.now()}`
                })
            })
            const result = await response.json()
            if (result.success) {
                setBalance(prev => prev ? { ...prev, credits: result.newBalance } : null)
            }
        } catch (err) {
            console.error("Purchase failed:", err)
        } finally {
            setPurchasing(null)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-6rem)]">
                <div className="neo-fab animate-pulse">
                    <Wallet className="w-6 h-6 text-white" />
                </div>
            </div>
        )
    }

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <PageTransition className="container mx-auto p-6 max-w-5xl">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 blur-[100px] rounded-full -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 blur-[120px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">Wallet</h1>
                <p className="text-muted-foreground">Manage your credits and purchase bundles</p>
            </motion.div>

            {/* Balance Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <NeoCard variant="gradient" className="mb-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="neo-fab !h-12 !w-12">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Current Balance</p>
                                <p className="text-4xl font-bold">
                                    {balance?.credits || 0}
                                    <span className="text-xl ml-2 text-muted-foreground">Credits</span>
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Use credits to boost requests, unlock contact info, or access premium features.
                        </p>
                    </div>
                </NeoCard>
            </motion.div>

            {/* Credit Bundles */}
            <h2 className="text-2xl font-bold mb-6">Buy Credits</h2>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
                {bundles.map(bundle => (
                    <motion.div key={bundle.id} variants={item}>
                        <NeoCard className={`relative h-full flex flex-col hover-lift ${bundle.popular ? 'ring-2 ring-primary' : ''}`}>
                            {bundle.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-xs px-4 py-1 rounded-full font-medium">
                                    Most Popular
                                </div>
                            )}

                            <div className="text-center flex-1">
                                <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${bundle.popular
                                        ? 'bg-gradient-to-br from-primary to-accent'
                                        : 'bg-secondary'
                                    }`}>
                                    <bundle.icon className={`w-6 h-6 ${bundle.popular ? 'text-white' : 'text-foreground'}`} />
                                </div>

                                <h3 className="font-bold text-lg mb-1">{bundle.name}</h3>
                                <p className="text-3xl font-bold text-primary mb-1">
                                    {bundle.credits}
                                    <span className="text-sm text-muted-foreground ml-1">credits</span>
                                </p>
                                <p className="text-xl font-semibold mb-1">{bundle.price_dzd.toLocaleString()} DZD</p>
                                <p className="text-xs text-muted-foreground">
                                    {Math.round(bundle.price_dzd / bundle.credits)} DZD/credit
                                </p>
                            </div>

                            <Button
                                className="w-full mt-4 gap-2"
                                variant={bundle.popular ? "default" : "neo"}
                                onClick={() => handlePurchase(bundle.id)}
                                disabled={purchasing === bundle.id}
                            >
                                {purchasing === bundle.id ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Purchase <ArrowRight className="w-4 h-4" /></>
                                )}
                            </Button>
                        </NeoCard>
                    </motion.div>
                ))}
            </motion.div>

            {/* Payment Methods */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <NeoCard>
                    <h3 className="font-bold text-lg mb-4">Payment Methods</h3>
                    <div className="space-y-3">
                        <div className="neo-inset !p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center text-white font-bold text-lg">
                                B
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">BaridiMob (CCP)</p>
                                <p className="text-sm text-muted-foreground">Transfer to: 0020000123456789</p>
                            </div>
                            <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="neo-inset !p-4 flex items-center gap-4 opacity-50">
                            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                C
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">CIB/Satim</p>
                                <p className="text-sm text-muted-foreground">Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </NeoCard>
            </motion.div>
        </PageTransition>
    )
}
