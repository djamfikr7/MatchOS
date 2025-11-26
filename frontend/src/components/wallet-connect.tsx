"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ethers } from "ethers"
import { toast } from "sonner"
import { Wallet } from "lucide-react"

export function WalletConnect() {
    const [account, setAccount] = useState<string | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)

    useEffect(() => {
        checkConnection()
    }, [])

    const checkConnection = async () => {
        if (typeof window !== "undefined" && (window as any).ethereum) {
            try {
                const provider = new ethers.BrowserProvider((window as any).ethereum)
                const accounts = await provider.listAccounts()
                if (accounts.length > 0) {
                    setAccount(accounts[0].address)
                }
            } catch (error) {
                console.error("Failed to check wallet connection:", error)
            }
        }
    }

    const connectWallet = async () => {
        if (typeof window === "undefined" || !(window as any).ethereum) {
            toast.error("Metamask not found. Please install it.")
            return
        }

        setIsConnecting(true)
        try {
            const provider = new ethers.BrowserProvider((window as any).ethereum)
            const accounts = await provider.send("eth_requestAccounts", [])
            setAccount(accounts[0])
            toast.success("Wallet connected!")
        } catch (error: any) {
            toast.error("Failed to connect wallet: " + error.message)
        } finally {
            setIsConnecting(false)
        }
    }

    return (
        <Button
            variant={account ? "outline" : "default"}
            onClick={account ? () => { } : connectWallet}
            className="gap-2"
            disabled={isConnecting}
        >
            <Wallet className="h-4 w-4" />
            {isConnecting ? "Connecting..." : account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect Wallet"}
        </Button>
    )
}
