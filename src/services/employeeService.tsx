import axios from "../configs/axios"
import type { BackendResponse } from "../interfaces/appInterface"

const getStateApi = (): Promise<BackendResponse> => {
    return axios.get("/employee/get-state")
}

const changeShiftStateApi = (now: string, state: boolean, lastestShift: number): Promise<BackendResponse> => {
    return axios.post("/employee/change-shift-state", {
        now, state, lastestShift
    })
}

const getShiftsApi = (month: number, year: number): Promise<BackendResponse> => {
    return axios.post("/employee/get-shifts", {
        month, year
    });
}

const savePasswordApi = (accountId: number, oldPassword: string, newPassword: string): Promise<BackendResponse> => {
    return axios.post("/employee/save-password", {
        accountId, oldPassword, newPassword
    })
}

export default {
    getStateApi, changeShiftStateApi, getShiftsApi, savePasswordApi
}