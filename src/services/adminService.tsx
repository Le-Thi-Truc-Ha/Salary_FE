import axios from "../configs/axios"
import type { BackendResponse } from "../interfaces/appInterface"

export const getShiftsApi = (employeeId: number, month: number, year: number): Promise<BackendResponse> => {
    return axios.post("/admin/get-shifts", {
        employeeId, month, year
    });
}

export const getEmployeeApi = (): Promise<BackendResponse> => {
    return axios.get("/admin/get-employee");
}

export const createEmployeeApi = (name: string): Promise<BackendResponse> => {
    return axios.post("/admin/create-employee", {
        name
    })
}

export const resetPasswordApi = (employeeId: number, newPassword: string): Promise<BackendResponse> => {
    return axios.post("/admin/reset-password", {
        employeeId, newPassword
    })
}

export const deleteEmployeeApi = (employeeId: number): Promise<BackendResponse> => {
    return axios.post("/admin/delete-employee", {
        employeeId
    })
}

export const updateShiftApi = (shiftId: number, timeIn: string, timeOut: string | null): Promise<BackendResponse> => {
    return axios.post("/admin/update-shift", {
        shiftId, timeIn, timeOut
    })
}