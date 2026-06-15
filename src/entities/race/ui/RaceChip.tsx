import { cn } from "@/shared/lib/utils";
import type { NormalizedRace } from "../model/types";

interface RaceChipProps {
  race: NormalizedRace;
  className?: string;
}

/**
 * 캘린더 셀 안에 들어가는 작은 대회 칩.
 */
export function RaceChip({ race, className }: RaceChipProps) {
  return (
    <div
      className={cn(
        "group block w-full truncate rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-1 text-[10px] leading-tight text-[var(--fg)] transition-colors hover:bg-white/[0.1]",
        className,
      )}
      title={race.title}
    >
      <span className="font-medium truncate block">{race.title}</span>
      {race.events.length > 0 && (
        <span className="text-[9px] text-[var(--fg-muted)] truncate block">
          {race.events.slice(0, 3).join(" · ")}
        </span>
      )}
    </div>
  );
}
