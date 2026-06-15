import * as yup from "yup";

export const raceSearchSchema = yup.object({
  keyword: yup
    .string()
    .max(40, "검색어는 40자 이내로 입력하세요.")
    .default(""),
  region: yup
    .string()
    .oneOf(["", "seoul", "busan", "jeju", "etc"])
    .default(""),
});

export type RaceSearchForm = yup.InferType<typeof raceSearchSchema>;
