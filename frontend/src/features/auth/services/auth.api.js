import axios from "axios";

const api = axios.create({
    baseURL: "/api/",
    withCredentials: true,
})

export async function register({ fullname, contact, email, password,role }) {
    const response = await api.post("auth/register", { fullname, contact, email, password,role })
    return response.data
};
export async function login({ email, password, role }) {
    const response = await api.post("auth/login", { email, password, role })
    return response.data
};
export async function getUser() {
    const response = await api.get("auth/getMe")
    return response.data
};  