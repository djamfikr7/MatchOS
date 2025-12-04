import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "neo-btn-primary rounded-xl text-white hover:-translate-y-1 active:translate-y-0",
        destructive:
          "neo-btn rounded-xl bg-destructive text-destructive-foreground hover:-translate-y-1 active:translate-y-0 hover-shimmer",
        outline:
          "neo-btn rounded-xl border-2 border-primary/30 bg-transparent text-foreground hover:border-primary hover:-translate-y-1",
        secondary:
          "neo-btn rounded-xl bg-secondary text-secondary-foreground hover:-translate-y-1 active:translate-y-0",
        ghost:
          "rounded-xl hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-transform",
        link:
          "text-primary underline-offset-4 hover:underline",
        neo:
          "neo-btn rounded-xl hover:-translate-y-1 active:translate-y-0 hover-shimmer",
        gradient:
          "rounded-xl text-white bg-gradient-to-r from-primary to-accent hover:-translate-y-1 active:translate-y-0 animate-gradient hover-glow",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-xl px-10 text-base",
        xl: "h-14 rounded-2xl px-12 text-lg",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
