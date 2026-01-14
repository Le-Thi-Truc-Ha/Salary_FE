import axios from "../configs/axios";
import type { BackendResponse } from "../interfaces/appInterface";

const reloadPageApi = (): Promise<BackendResponse> => {
    return axios.get("/reload-page");
}

const loginApi = (username: string, password: string): Promise<BackendResponse> => {
    return axios.post("/login", {
        username, password
    })
}

const logoutApi = (): Promise<BackendResponse> => {
    return axios.get("/logout");
}

export default {
    reloadPageApi, loginApi, logoutApi
}