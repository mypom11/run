import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  // 외부 이미지 호스트 화이트리스트. next/image가 최적화한다.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.runable.me" },
      { protocol: "https", hostname: "runable.me" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // 무거운 클라이언트 패키지를 서버 번들에서 분리 / 동적 분할 유도
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "@tanstack/react-query"],
  },

  // 보안 헤더만 부여. /_next/static의 immutable 캐시는 Next가 기본 설정.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
