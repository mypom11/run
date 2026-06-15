import { cn } from "@/shared/lib/utils";
import type { NormalizedRace } from "../model/types";

interface RaceChipProps {
  race: NormalizedRace;
  className?: string;
  onClick?: () => void;
}

/**
 * 캘린더 셀 안에 들어가는 작은 대회 칩.
 * onClick이 있으면 button으로 렌더해서 클릭 가능.
 */
export function RaceChip({ race, className, onClick }: RaceChipProps) {
  const inner = (
    <>
      <span className="font-medium truncate block">{race.title}</span>
      {race.events.length > 0 && (
        <span className="text-[9px] text-[var(--fg-muted)] truncate block">
          {race.events.slice(0, 3).join(" · ")}
        </span>
      )}
    </>
  );

  const baseCls = cn(
    "group block w-full truncate rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-1 text-left text-[10px] leading-tight text-[var(--fg)] transition-colors hover:bg-white/[0.12] hover:border-white/20",
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={cn(baseCls, "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]")}
        title={race.title}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={baseCls} title={race.title}>
      {inner}
    </div>
  );
}
