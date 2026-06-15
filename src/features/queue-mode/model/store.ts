/**
 * 트래픽 보호 모드 상태.
 * - 켜져 있으면 시작하기 클릭 시 대기실(/queue)을 거친다.
 * - localStorage에 영속화 (사용자 환경 설정 성격).
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useIsClient } from "@/shared/hooks/useIsClient";

interface QueueModeState {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
}

export const useQueueMode = create<QueueModeState>()(
  persist(
    (set) => ({
      enabled: false,
      setEnabled: (enabled) => set({ enabled }),
      toggle: () => set((s) => ({ enabled: !s.enabled })),
    }),
    {
      name: "runable-queue-mode",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/**
 * SSR 시 enabled는 항상 false → 하이드레이션 안전.
 * useIsClient(useSyncExternalStore)로 클라이언트 진입 이후에만 실제 store 값 사용.
 */
export function useHydratedQueueMode() {
  const enabled = useQueueMode((s) => s.enabled);
  const setEnabled = useQueueMode((s) => s.setEnabled);
  const toggle = useQueueMode((s) => s.toggle);
  const mounted = useIsClient();
  return {
    enabled: mounted ? enabled : false,
    setEnabled,
    toggle,
    mounted,
  };
}
