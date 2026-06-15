"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Timer, Gauge } from "lucide-react";
import { GlassCard } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import {
  paceFormSchema,
  treadmillSchema,
  type PaceForm,
  type TreadmillForm,
} from "../model/schema";
import {
  PRESETS,
  paceSecToSpeed,
  paceSecondsToString,
  speedToPaceSec,
  totalSecondsToHms,
  totalTimeSec,
} from "../model/pace";

export function PaceCalculator() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <PaceBlock />
      <TreadmillBlock />
    </div>
  );
}

function PaceBlock() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<PaceForm>({
    resolver: yupResolver(paceFormSchema),
    mode: "onChange",
    defaultValues: { distance: 10, paceMin: 5, paceSec: 30 },
  });

  const distance = Number(useWatch({ control, name: "distance" })) || 0;
  const paceMin = Number(useWatch({ control, name: "paceMin" })) || 0;
  const paceSec = Number(useWatch({ control, name: "paceSec" })) || 0;

  const result = useMemo(() => {
    const totalPaceSec = paceMin * 60 + paceSec;
    const total = totalTimeSec(distance, totalPaceSec);
    const speed = paceSecToSpeed(totalPaceSec);
    return {
      time: totalSecondsToHms(total),
      pace: paceSecondsToString(totalPaceSec),
      speed: speed > 0 ? speed.toFixed(2) : "—",
    };
  }, [distance, paceMin, paceSec]);

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2 text-[var(--accent)]">
        <Timer className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">
          페이스 계산
        </span>
      </div>
      <h2 className="font-display text-2xl tracking-tight">
        거리 + 페이스 → 완주 시간
      </h2>

      <div className="mt-5 space-y-4">
        <Field
          label="거리 (km)"
          error={errors.distance?.message}
          right={
            <div className="flex gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="rounded-full bg-white/[0.06] px-2 py-1 text-[10px] font-medium text-[var(--fg-muted)] hover:bg-white/[0.12] hover:text-[var(--fg)]"
                  onClick={() => setValue("distance", p.km, { shouldValidate: true })}
                >
                  {p.label}
                </button>
              ))}
            </div>
          }
        >
          <input
            type="number"
            step="0.001"
            {...register("distance", { valueAsNumber: true })}
            className={inputCls(!!errors.distance)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="페이스 (분/km)" error={errors.paceMin?.message}>
            <input
              type="number"
              step="1"
              {...register("paceMin", { valueAsNumber: true })}
              className={inputCls(!!errors.paceMin)}
            />
          </Field>
          <Field label="페이스 (초)" error={errors.paceSec?.message}>
            <input
              type="number"
              step="1"
              {...register("paceSec", { valueAsNumber: true })}
              className={inputCls(!!errors.paceSec)}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-5">
        <Stat label="완주 시간" value={result.time} primary />
        <Stat label="페이스" value={result.pace} />
        <Stat label="속도" value={`${result.speed} km/h`} />
      </div>
    </GlassCard>
  );
}

function TreadmillBlock() {
  const {
    register,
    control,
    formState: { errors },
  } = useForm<TreadmillForm>({
    resolver: yupResolver(treadmillSchema),
    mode: "onChange",
    defaultValues: { speedKmh: 10 },
  });
  const speed = Number(useWatch({ control, name: "speedKmh" })) || 0;
  const paceSec = speedToPaceSec(speed);
  const pace = paceSecondsToString(paceSec);
  const min10k = totalSecondsToHms(10 * paceSec);
  const minHalf = totalSecondsToHms(21.0975 * paceSec);

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2 text-[var(--accent)]">
        <Gauge className="size-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">
          트레드밀 변환
        </span>
      </div>
      <h2 className="font-display text-2xl tracking-tight">
        트레드밀 속도 → 페이스
      </h2>

      <Field
        className="mt-5"
        label="트레드밀 속도 (km/h)"
        error={errors.speedKmh?.message}
      >
        <input
          type="number"
          step="0.1"
          {...register("speedKmh", { valueAsNumber: true })}
          className={inputCls(!!errors.speedKmh)}
        />
      </Field>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-5">
        <Stat label="페이스" value={pace} primary />
        <Stat label="10K 예상" value={min10k} />
        <Stat label="하프 예상" value={minHalf} />
      </div>

      <p className="mt-5 text-xs text-[var(--fg-subtle)]">
        실제 야외 러닝은 노면·바람·고도에 따라 페이스가 5~10초/km 더 느릴 수
        있습니다.
      </p>
    </GlassCard>
  );
}

function Field({
  label,
  error,
  children,
  className,
  right,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  right?: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--fg-muted)]">
          {label}
        </span>
        {right}
      </div>
      {children}
      {error && (
        <p className="mt-1 text-xs text-[var(--accent-strong)]" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "h-11 w-full rounded-[var(--radius-md)] bg-white/[0.04] px-3 text-base text-[var(--fg)] outline-none ring-1 ring-white/10 transition focus:bg-white/[0.08] focus:ring-[var(--accent)] tabular-nums",
    hasError && "ring-[var(--accent)]",
  );
}

function Stat({
  label,
  value,
  primary,
}: {
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--fg-subtle)]">
        {label}
      </div>
      <div
        className={cn(
          "font-display mt-1 tracking-tight tabular-nums",
          primary ? "text-3xl text-[var(--accent-strong)]" : "text-xl",
        )}
      >
        {value}
      </div>
    </div>
  );
}
