import "./App.css";
import { RouterProvider } from "react-router";
import { useSelector } from "react-redux";
import { store } from "./app.store";
import { routes } from "./app.routes";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";

function App() {
  const { handleGetMe } = useAuth();
  const user = useSelector((state) => state.auth.user);
  
  useEffect(() => {
    handleGetMe();
  }, []);
  return (
      <RouterProvider router={routes} />
  );
}

export default App;
