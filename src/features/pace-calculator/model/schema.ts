import * as yup from "yup";

export const paceFormSchema = yup.object({
  distance: yup
    .number()
    .typeError("거리는 숫자입니다")
    .positive("거리는 0보다 커야 합니다")
    .max(500, "거리는 500km 이하로 입력하세요")
    .required(),
  paceMin: yup
    .number()
    .typeError("페이스(분)는 숫자입니다")
    .min(2, "페이스는 2분/km 이상")
    .max(20, "페이스는 20분/km 이하")
    .required(),
  paceSec: yup
    .number()
    .typeError("페이스(초)는 숫자입니다")
    .min(0, "0~59")
    .max(59, "0~59")
    .required(),
});

export type PaceForm = yup.InferType<typeof paceFormSchema>;

export const treadmillSchema = yup.object({
  speedKmh: yup
    .number()
    .typeError("속도는 숫자입니다")
    .positive("0보다 커야 합니다")
    .max(30, "30km/h 이하")
    .required(),
});

export type TreadmillForm = yup.InferType<typeof treadmillSchema>;
