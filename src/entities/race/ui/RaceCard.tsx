import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Badge, GlassCard } from "@/shared/ui";
import { formatDateShort } from "@/shared/lib/utils";
import type { NormalizedRace } from "../model/types";

interface RaceCardProps {
  race: NormalizedRace;
}

export function RaceCard({ race }: RaceCardProps) {
  const inner = (
    <GlassCard className="group relative h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg leading-tight text-[var(--fg)] truncate">
            {race.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {race.events.slice(0, 4).map((ev) => (
              <Badge key={ev} tone="accent">
                {ev}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-[var(--fg-muted)]">
        {race.startDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 opacity-70" />
            <span>{formatDateShort(race.startDate)}</span>
            {race.endDate && race.endDate !== race.startDate && (
              <span> ~ {formatDateShort(race.endDate)}</span>
            )}
          </div>
        )}
        {race.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 opacity-70" />
            <span className="truncate">{race.location}</span>
          </div>
        )}
      </div>
    </GlassCard>
  );

  return race.compUrl ? (
    <Link href={race.compUrl} className="block focus-visible:outline-none">
      {inner}
    </Link>
  ) : (
    inner
  );
}
