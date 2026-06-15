import { CommunityFeed } from "@/features/community-feed";

export function CommunityView() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[var(--accent)]">
          Community
        </p>
        <h1 className="font-display mt-1 text-4xl tracking-tight sm:text-5xl">
          러너 커뮤니티
        </h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          대회 후기, 훈련 로그, 해외 러닝까지 — 러너들의 진짜 이야기.
        </p>
      </header>
      <CommunityFeed />
    </div>
  );
}
