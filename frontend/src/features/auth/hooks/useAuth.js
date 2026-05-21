import { setUser, setError, setLoading } from "../state/auth.slice";
import { register, login} from "../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
    const dispatch = useDispatch();
    async function handleRegister({ email, fullname, contact, password, role }) {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const res = await register({ email, fullname, contact, password, role});
            const userData = res.data?.response || res.data || res.response;
            dispatch(setUser(userData));
            return userData;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Registration failed. Please check your details and try again.";
            dispatch(setError(errorMsg));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password, role }) {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const res = await login({ email, password, role });
            const userData = res.data?.response || res.data || res.response;
            dispatch(setUser(userData));
            return userData;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Login failed. Please check your credentials and try again.";
            dispatch(setError(errorMsg));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }
    return {
        handleRegister,
        handleLogin,
    }
}