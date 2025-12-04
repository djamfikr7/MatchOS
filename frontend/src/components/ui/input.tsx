import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'neo'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant = 'default', ...props }, ref) => {
        const baseStyles = variant === 'neo'
            ? "neo-input"
            : "flex h-11 w-full rounded-xl border-0 bg-input px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"

        return (
            <input
                type={type}
                className={cn(baseStyles, className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
