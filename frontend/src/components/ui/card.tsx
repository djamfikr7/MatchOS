import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "neo-card rounded-2xl bg-card text-card-foreground transition-all duration-300 hover:-translate-y-1",
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-bold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

// New Neomorphic Card Variants
const NeoCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'inset' | 'glass' | 'gradient' }
>(({ className, variant = 'default', ...props }, ref) => {
    const variants = {
        default: "neo-card",
        inset: "neo-inset",
        glass: "glass-card",
        gradient: "neo-card bg-gradient-to-br from-primary/10 to-accent/10",
    }

    return (
        <div
            ref={ref}
            className={cn(
                variants[variant],
                "rounded-2xl text-card-foreground transition-all duration-300",
                className
            )}
            {...props}
        />
    )
})
NeoCard.displayName = "NeoCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, NeoCard }
