"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  const { language } = useAppStore();
  const isBn = language === "bn";

  const displayTitle = title || (isBn ? "তথ্যের রেকর্ড লোড করা যায়নি" : "Failed to load land records");
  const displayMessage =
    message ||
    (isBn
      ? "ক্যাডাস্ট্রাল জরিপ ও রিমোট সেন্সিং তথ্য লোড করার সময় একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
      : "An error occurred while loading cadastral survey and remote sensing data. Please try again.");
  const displayRetry = isBn ? "পুনরায় চেষ্টা করুন" : "Retry";

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
        {displayTitle}
      </h3>
      <p className="text-xs sm:text-sm text-secondary max-w-sm mb-6 leading-relaxed">
        {displayMessage}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-lime px-5 py-2.5 text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{displayRetry}</span>
        </button>
      )}
    </div>
  );
}
