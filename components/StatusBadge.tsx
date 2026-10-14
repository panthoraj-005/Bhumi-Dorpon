import React from "react";
import { CheckCircle2, Clock, Hourglass, MinusCircle, Ban } from "lucide-react";
import { CompensationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: CompensationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const configs: Record<
    CompensationStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    paid: {
      label: "Paid",
      bg: "bg-[#DFF3E8]",
      text: "text-[#2F9E62]",
      border: "border-[#B2E4CB]",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    approved: {
      label: "Approved",
      bg: "bg-[#E0F2FE]",
      text: "text-[#0284C7]",
      border: "border-[#BAE6FD]",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    pending: {
      label: "Pending",
      bg: "bg-[#FEF3C7]",
      text: "text-[#D97706]",
      border: "border-[#FDE68A]",
      icon: <Hourglass className="w-3.5 h-3.5" />,
    },
    not_applied: {
      label: "Not applied",
      bg: "bg-[#F0F2EA]",
      text: "text-[#4A5043]",
      border: "border-[#E4E7DC]",
      icon: <MinusCircle className="w-3.5 h-3.5" />,
    },
    not_applicable: {
      label: "N/A (State Land)",
      bg: "bg-[#F4F4F2]",
      text: "text-[#7B8274]",
      border: "border-dashed border-[#D7DACF]",
      icon: <Ban className="w-3.5 h-3.5" />,
    },
  };

  const current = configs[status] || configs.not_applied;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill border text-xs font-medium whitespace-nowrap",
        current.bg,
        current.text,
        current.border,
        className
      )}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
}
