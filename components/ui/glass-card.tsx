import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
}

export function GlassCard({ children, className, hover = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300",
        hover && "hover:bg-white/15 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
