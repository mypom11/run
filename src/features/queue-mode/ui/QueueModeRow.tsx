"use client";

import { Shield, ShieldCheck } from "lucide-react";
import { Switch } from "@/shared/ui";
import { useHydratedQueueMode } from "../model/store";

/**
 * 모바일 메뉴 내부에 들어가는 행. 시작하기 버튼 위에 두면 자연스럽다.
 */
export function QueueModeRow() {
  const { enabled, setEnabled } = useHydratedQueueMode();
  const Icon = enabled ? ShieldCheck : Shield;
  return (
    <label className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-white/[0.04] px-4 py-3 cursor-pointer">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-full ${enabled ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "bg-white/[0.06] text-[var(--fg-muted)]"}`}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="text-sm font-medium text-[var(--fg)]">트래픽 보호</div>
          <div className="text-[11px] text-[var(--fg-muted)] line-clamp-1">
            접수 폭주 시 대기실을 거쳐 안전하게 진입
          </div>
        </div>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={setEnabled}
        aria-label="트래픽 보호 모드"
      />
    </label>
  );
}
