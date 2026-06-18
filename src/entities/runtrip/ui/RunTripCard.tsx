import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Plane } from "lucide-react";
import { Badge, GlassCard, Pressable } from "@/shared/ui";
import { formatDateShort } from "@/shared/lib/utils";
import { priceLabel } from "../model/trips";
import type { RunTrip } from "../model/types";

interface RunTripCardProps {
  trip: RunTrip;
}

export function RunTripCard({ trip }: RunTripCardProps) {
  return (
    <Link
      href={`/runtrip/${trip.slug}`}
      className="group block focus-visible:outline-none"
    >
      <Pressable className="h-full">
      <GlassCard className="relative h-full overflow-hidden p-0 transition-colors duration-300 group-hover:border-white/20">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={trip.cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute left-4 right-4 top-4 flex flex-wrap items-center gap-1.5">
            {trip.badges?.map((b) => (
              <Badge key={b} tone={b === "BEST" ? "accent" : "glass"}>
                {b}
              </Badge>
            ))}
          </div>
          <div className="absolute inset-x-4 bottom-4 text-white">
            <div className="flex items-center gap-1.5 text-xs opacity-80">
              <MapPin className="size-3.5" />
              {trip.country} · {trip.destination}
            </div>
            <h3 className="font-display mt-1 text-xl leading-tight tracking-tight">
              {trip.raceName}
            </h3>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm text-[var(--fg-muted)] line-clamp-2">
            {trip.tagline}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[var(--fg-muted)]">
              <Calendar className="size-3.5" />
              <span>
                {formatDateShort(trip.startDate)} ~ {formatDateShort(trip.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[var(--fg-muted)]">
              <Plane className="size-3.5" />
              <span>{trip.nights}박</span>
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--fg-subtle)]">
                from
              </div>
              <div className="font-display text-2xl tracking-tight">
                {priceLabel(trip.priceFrom)}
              </div>
            </div>
            <div className="rounded-[var(--radius-pill)] bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              자세히 →
            </div>
          </div>
        </div>
      </GlassCard>
      </Pressable>
    </Link>
  );
}
