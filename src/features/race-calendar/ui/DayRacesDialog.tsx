"use client";

import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { Badge, Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import type { NormalizedRace } from "@/entities/race";

interface DayRacesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  iso: string | null; // YYYY-MM-DD
  races: NormalizedRace[];
}

export function DayRacesDialog({
  open,
  onOpenChange,
  iso,
  races,
}: DayRacesDialogProps) {
  let dateLabel = "";
  if (iso) {
    try {
      dateLabel = format(parseISO(iso), "M월 d일 (EEEE)", { locale: ko });
    } catch {
      dateLabel = iso;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <p className="text-xs uppercase tracking-widest text-[var(--accent)]">
            {iso}
          </p>
          <DialogTitle className="mt-1">{dateLabel}</DialogTitle>
          <p className="mt-1 text-xs text-[var(--fg-muted)]">
            이날 열리는 대회 {races.length}개
          </p>
        </DialogHeader>
        <DialogBody>
          {races.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--fg-muted)]">
              대회가 없습니다.
            </div>
          ) : (
            <ul className="space-y-3">
              {races.map((race) => (
                <li
                  key={race.id}
                  className="rounded-[var(--radius-md)] border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-base leading-tight tracking-tight">
                        {race.title}
                      </h3>
                      {race.events.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {race.events.slice(0, 5).map((e) => (
                            <Badge key={e} tone="accent">
                              {e}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 space-y-1 text-xs text-[var(--fg-muted)]">
                        {race.startDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-3.5 opacity-70" />
                            <span>
                              {format(parseISO(race.startDate), "yyyy.MM.dd HH:mm", {
                                locale: ko,
                              })}
                            </span>
                          </div>
                        )}
                        {race.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 opacity-70" />
                            <span>{race.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {race.officialUrl && (
                    <div className="mt-4 border-t border-white/[0.06] pt-3">
                      <a
                        href={race.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--accent-strong)]"
                      >
                        공식 사이트
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
