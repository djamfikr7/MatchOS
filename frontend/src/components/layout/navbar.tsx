"use client"

import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const navItems = [
    { name: "Explore", href: "/explore" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "For Providers", href: "/providers" },
]

import { WalletConnect } from "@/components/wallet-connect"

// ... imports

export function Navbar() {
    const pathname = usePathname()

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Logo />

                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <WalletConnect />
                    <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Log in
                    </Link>
                    <Button variant="default" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                        Get Started
                    </Button>
                </div>
            </div>
        </header>
    )
}
