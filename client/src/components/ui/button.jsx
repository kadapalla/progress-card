import * as React from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.97] cursor-pointer active:duration-75",
          {
            "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.4)] dark:from-sky-500 dark:to-indigo-500 dark:hover:from-sky-400 dark:hover:to-indigo-400 dark:shadow-[0_4px_12px_rgba(56,189,248,0.15)] dark:hover:shadow-[0_6px_20px_rgba(56,189,248,0.3)]": variant === "default",
            "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-[0_4px_12px_rgba(225,29,72,0.25)] hover:shadow-[0_6px_20px_rgba(225,29,72,0.4)]": variant === "destructive",
            "border border-input/60 bg-background/50 backdrop-blur-md hover:bg-indigo-50/40 dark:hover:bg-indigo-950/15 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-500/40 dark:hover:border-indigo-400/40": variant === "outline",
            "bg-secondary/80 text-secondary-foreground hover:bg-secondary": variant === "secondary",
            "hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-foreground": variant === "ghost",
            "text-indigo-600 dark:text-sky-400 underline-offset-4 hover:underline hover:scale-100": variant === "link",
            "h-10 px-5 py-2": size === "default",
            "h-9 rounded-lg px-3.5": size === "sm",
            "h-11 rounded-xl px-8": size === "lg",
            "h-10 w-10 p-0 rounded-full": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
