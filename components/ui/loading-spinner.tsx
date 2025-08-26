import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
    className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
    return (
        <div className={cn("flex items-center justify-center", className)}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    )
}
