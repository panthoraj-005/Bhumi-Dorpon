import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Failed to load land records",
  message = "An error occurred while loading cadastral survey and remote sensing data. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "bhumidorpon-card p-8 sm:p-10 flex flex-col items-center justify-center text-center max-w-lg mx-auto my-6 border-[#FDE68A] bg-[#FEFDF5]",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-ink mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-secondary max-w-sm mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-lime px-5 py-2.5 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
