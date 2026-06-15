import Link from "next/link";
import { Button, GlassCard } from "@/shared/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 pt-24 pb-20">
      <GlassCard className="p-10 text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--accent)]">
          404
        </p>
        <h1 className="font-display mt-2 text-4xl tracking-tight">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          요청하신 페이지가 존재하지 않거나 이동했을 수 있어요.
        </p>
        <div className="mt-7">
          <Button asChild>
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
