import Link from "next/link"

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-lg transition-transform group-hover:scale-110">
                M
                <div className="absolute inset-0 rounded-lg bg-primary/50 blur-sm -z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                MatchOS
            </span>
        </Link>
    )
}
