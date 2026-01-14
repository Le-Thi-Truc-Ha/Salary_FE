export interface ShiftTable {
    key: string,
    id: number,
    date: string,
    timeIn: string,
    timeOut: string
}

export interface ShiftData {
    id: number,
    timeIn: string,
    timeOut: string | null
}