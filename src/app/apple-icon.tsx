import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FF7A3A 0%, #FF5A1F 100%)",
          borderRadius: 36,
        }}
      >
        <svg
          width={120}
          height={120}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 18c4-1 6-3 8-6s4-6 8-7"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
