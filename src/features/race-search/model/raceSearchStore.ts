/**
 * 화면 간(race header → calendar) 공유되는 검색 상태.
 * 서버 데이터는 React Query, 이건 순수 UI 상태이므로 zustand.
 */
import { create } from "zustand";

interface RaceSearchState {
  keyword: string;
  region: string;
  setKeyword: (k: string) => void;
  setRegion: (r: string) => void;
  reset: () => void;
}

export const useRaceSearchStore = create<RaceSearchState>((set) => ({
  keyword: "",
  region: "",
  setKeyword: (keyword) => set({ keyword }),
  setRegion: (region) => set({ region }),
  reset: () => set({ keyword: "", region: "" }),
}));
