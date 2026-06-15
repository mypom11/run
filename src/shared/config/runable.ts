/**
 * Runable.me 공개 API 설정. 이 값들은 서버에서만 사용한다.
 * 클라이언트는 우리의 BFF (/api/*)만 호출한다.
 */
export const RUNABLE_API_BASE = "https://runable.me/next-api/index/v1";
export const RUNABLE_STORAGE_BASE = "https://storage.runable.me";

export const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/race", label: "대회일정" },
  { href: "/magazine", label: "매거진" },
  { href: "/runtrip", label: "런트립" },
  { href: "/pace-calculator", label: "페이스" },
] as const;
