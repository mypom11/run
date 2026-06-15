"use client";

import { Shield, ShieldCheck } from "lucide-react";
import { Switch } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { useHydratedQueueMode } from "../model/store";

interface QueueModeToggleProps {
  className?: string;
}

/**
 * 데스크탑/태블릿 헤더용 컴팩트 토글. md+ 에서만 노출.
 * 모바일은 MobileNavMenu의 QueueModeRow를 사용.
 */
export function QueueModeToggle({ className }: QueueModeToggleProps) {
  const { enabled, setEnabled } = useHydratedQueueMode();
  const Icon = enabled ? ShieldCheck : Shield;
  return (
    <label
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-[var(--radius-pill)] glass px-3 cursor-pointer transition-colors",
        enabled && "ring-1 ring-[var(--accent)]/40 bg-[var(--accent-soft)]",
        className,
      )}
      title="대규모 접수가 예상되면 켜세요. 대기실을 거쳐 안전하게 진입합니다."
    >
      <Icon
        className={cn(
          "size-3.5 transition-colors",
          enabled ? "text-[var(--accent-strong)]" : "text-[var(--fg-muted)]",
        )}
      />
      <span className="hidden lg:inline text-xs font-medium">
        트래픽 보호
      </span>
      <Switch
        checked={enabled}
        onCheckedChange={setEnabled}
        aria-label="트래픽 보호 모드"
      />
    </label>
  );
}
