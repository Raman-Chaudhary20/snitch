import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/",
    withCredentials: true,
})

export async function register({ fullname, contact, email, password,isSeller }) {
    return await api.post("auth/register", { fullname, contact, email, password,isSeller })
}