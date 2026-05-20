import { setUser, setError, setLoading } from "../state/auth.slice";
import { register } from "../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
    const dispatch = useDispatch();
    async function handleRegister({ email, fullname, contact, password, isSeller = false }) {
        const data = await register({ email, fullname, contact, password, isSeller })

        dispatch(setUser(data.response));
    }
    return {
        handleRegister
    }
}