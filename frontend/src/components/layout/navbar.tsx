"use client"

import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletConnect } from "@/components/wallet-connect"
import { Wallet, User, Menu, X } from "lucide-react"
import { useState } from "react"

const navItems = [
    { name: "Explore", href: "/explore" },
    { name: "Wallet", href: "/wallet" },
    { name: "Dashboard", href: "/dashboard" },
]

export function Navbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-4 mt-4">
                <div className="neo-card !p-0 px-6 py-3 rounded-2xl">
                    <div className="flex h-14 items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Logo />
                            <nav className="hidden md:flex items-center gap-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                                            pathname === item.href
                                                ? "neo-inset text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <div className="hidden md:flex items-center gap-3">
                                <WalletConnect />
                                <Link href="/login">
                                    <Button variant="neo" size="sm" className="gap-2">
                                        <User className="w-4 h-4" />
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="gap-2">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                className="md:hidden neo-btn p-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-border/50 mt-3 pt-4 pb-2 stagger-children">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-2",
                                        pathname === item.href
                                            ? "neo-inset text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="flex gap-2 mt-4">
                                <Link href="/login" className="flex-1">
                                    <Button variant="neo" className="w-full">Log in</Button>
                                </Link>
                                <Link href="/register" className="flex-1">
                                    <Button className="w-full">Sign up</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
