"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="neo-btn h-10 w-10 p-0 flex items-center justify-center">
                <div className="h-5 w-5" />
            </button>
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="neo-btn h-10 w-10 p-0 flex items-center justify-center hover-glow group"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-500 group-hover:rotate-180" />
            ) : (
                <Moon className="h-5 w-5 text-primary transition-transform duration-500 group-hover:-rotate-12" />
            )}
        </button>
    )
}
