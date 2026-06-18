"use client";

/**
 * framer-motion 기반 공용 모션 프리미티브.
 * 트리 말단에서만 "use client"가 새도록 여기 한 곳에 모은다 (Hard Rule 2).
 * 서버 컴포넌트는 이 래퍼에 children을 넘겨 서버로 남는다.
 */

import {
  motion,
  useInView,
  useReducedMotion,
  animate,
  type HTMLMotionProps,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

// Apple-스러운 ease-out. globals.css의 fade-in-up과 동일한 곡선.
const EASE = [0.22, 1, 0.36, 1] as const;
export const SPRING = { type: "spring", stiffness: 380, damping: 28, mass: 0.7 } as const;

interface RevealProps {
  children: ReactNode;
  /** 리스트 내 위치 — 스태거 지연을 만든다. */
  index?: number;
  /** index 스태거 위에 더하는 추가 지연(초). */
  delay?: number;
  /** 항목당 스태거 간격(초). */
  step?: number;
  /** 진입 시 들어올릴 거리(px). */
  y?: number;
  className?: string;
}

/**
 * 진입 래퍼: 스크롤로 들어올 때 콘텐츠를 페이드+리프트한다.
 * 뷰포트 기반(whileInView)이라 above-the-fold가 아닌 섹션에 적합.
 */
export function Reveal({
  children,
  index = 0,
  delay = 0,
  step = 0.06,
  y = 16,
  className,
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: EASE, delay: delay + index * step }}
    >
      {children}
    </motion.div>
  );
}

interface PressableProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  /** 눌렀을 때 스케일 (기본 0.97). */
  scaleTo?: number;
  /** 호버 시 살짝 떠오르기. */
  lift?: boolean;
}

/**
 * 터치/클릭 시 스프링으로 눌렸다 돌아오는 촉각 피드백 래퍼.
 * 카드·탭 등 누를 수 있는 표면에 두른다. (앱의 PressableScale 포팅)
 */
export function Pressable({
  children,
  scaleTo = 0.97,
  lift = true,
  className,
  ...rest
}: PressableProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      whileHover={lift ? { y: -4 } : undefined}
      whileTap={{ scale: scaleTo }}
      transition={SPRING}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  value: number;
  decimals?: number;
  /** 트윈 길이(초). */
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * 뷰포트에 들어오면 0 → value로 숫자를 트윈한다.
 * 매 프레임 React 리렌더 없이 textContent만 갱신. (앱의 CountUp 포팅)
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1.2,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const final = `${prefix}${value.toFixed(decimals)}${suffix}`;
    if (reduce || !inView) {
      if (reduce) el.textContent = final;
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, duration, prefix, suffix, reduce]);

  return (
    <span ref={ref} className={cn(className)}>
      {`${prefix}${(0).toFixed(decimals)}${suffix}`}
    </span>
  );
}
