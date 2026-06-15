export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06] pb-24 pt-12 md:pb-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-display text-2xl tracking-tight">runable</div>
            <p className="mt-2 text-sm text-[var(--fg-muted)] max-w-xs">
              달리자, 나답게. 대회 접수부터 기록까지 러너를 위한 올인원
              플랫폼.
            </p>
          </div>
          <div className="text-sm text-[var(--fg-muted)] space-y-1.5">
            <div className="text-[var(--fg)] font-medium mb-2">서비스</div>
            <div>대회일정</div>
            <div>매거진</div>
            <div>런트립</div>
            <div>페이스 계산기</div>
          </div>
          <div className="text-sm text-[var(--fg-muted)] space-y-1.5">
            <div className="text-[var(--fg)] font-medium mb-2">고객지원</div>
            <div>공지사항</div>
            <div>이용약관</div>
            <div>개인정보처리방침</div>
            <div>고객센터</div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/[0.06] pt-6 text-xs text-[var(--fg-subtle)]">
          © {new Date().getFullYear()} Runable. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
