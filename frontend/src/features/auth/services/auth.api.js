import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/",
    withCredentials: true,
})

export async function register({ fullname, contact, email, password,role }) {
    return await api.post("auth/register", { fullname, contact, email, password,role })
};
export async function login({ email, password, role }) {
    return await api.post("auth/login", { email, password, role })
}   