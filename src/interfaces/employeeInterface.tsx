import type { Dayjs } from "dayjs";

export interface ShiftTable {
    key: string,
    id: number,
    date: Dayjs,
    timeIn: Dayjs,
    timeOut: Dayjs | null,
    time: number | null
}

export interface ShiftData {
    id: number,
    timeIn: string,
    timeOut: string | null,
    time: number | null
}