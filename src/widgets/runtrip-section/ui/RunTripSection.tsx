import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RUNTRIPS, RunTripCard } from "@/entities/runtrip";

export function RunTripSection() {
  const items = RUNTRIPS.slice(0, 3);
  return (
    <section className="py-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--accent)]">
            Runtrip
          </p>
          <h2 className="font-display mt-1 text-3xl tracking-tight sm:text-4xl">
            세계의 코스로
          </h2>
        </div>
        <Link
          href="/runtrip"
          className="hidden items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] sm:flex"
        >
          전체 상품 <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <RunTripCard key={t.id} trip={t} />
        ))}
      </div>
    </section>
  );
}
