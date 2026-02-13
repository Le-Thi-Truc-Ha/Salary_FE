import type { Dayjs } from "dayjs"
import type { Dispatch, SetStateAction } from "react"
import type { ShiftTable } from "./employeeInterface"

export interface EmployeeTable {
    key: string,
    id: number,
    username: string,
    name: string
}

export interface UpdateShiftModalProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    shiftId: number,
    dateProp: Dayjs,
    timeIn: Dayjs,
    timeOut: Dayjs | null,
    setShifts: Dispatch<SetStateAction<ShiftTable[]>>,
    setTotalHour: Dispatch<SetStateAction<number>>
}