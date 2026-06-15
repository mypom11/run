"use client";

import Link from "next/link";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { useHydratedQueueMode } from "../model/store";

interface StartButtonProps {
  className?: string;
  variant?: "primary" | "glass";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children?: React.ReactNode;
  /** 보호 모드와 무관하게 갈 최종 목적지 */
  destination?: string;
}

/**
 * 시작하기 버튼. 트래픽 보호 모드가 켜져 있으면 /queue로 보낸다.
 */
export function StartButton({
  className,
  variant = "primary",
  size = "sm",
  fullWidth,
  children = "시작하기",
  destination = "/reserve",
}: StartButtonProps) {
  const { enabled, mounted } = useHydratedQueueMode();
  const href =
    mounted && enabled
      ? `/queue?next=${encodeURIComponent(destination)}`
      : destination;

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn(fullWidth && "w-full", className)}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
