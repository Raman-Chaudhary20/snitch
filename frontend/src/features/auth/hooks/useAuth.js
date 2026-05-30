import { setUser, setError, setLoading } from "../state/auth.slice";
import { register, login, getUser } from "../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();
  async function handleRegister({ email, fullname, contact, password, role }) {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const res = await register({ email, fullname, contact, password, role });
      const data = res.data?.response || res.data || res.response;
      dispatch(setUser(data.user));
      return data.user;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please check your details and try again.";
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
      const data = await login({ email, password, role });
      dispatch(setUser(data.user));
      return data.user;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials and try again.";
      dispatch(setError(errorMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await getUser();
      dispatch(setUser(data.user));
    } catch (err) {
      const errorMsg = err.message;
      dispatch(setError(errorMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }
  return {
    handleRegister,
    handleLogin,
    handleGetMe,
  };
};
