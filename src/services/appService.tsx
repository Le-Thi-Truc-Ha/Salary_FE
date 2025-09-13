import axios from "../configs/axios";
import type { BackendResponse } from "../interfaces/appInterface";

const reloadPageApi = (): Promise<BackendResponse> => {
    return axios.get("/reload-page");
}

const logoutApi = (): Promise<BackendResponse> => {
    return axios.get("/logout");
}

export default {
    reloadPageApi, logoutApi
}