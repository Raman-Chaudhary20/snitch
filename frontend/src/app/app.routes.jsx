import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import AllProducts from "../features/products/pages/AllProducts";
import Protected from "../features/auth/components/Protected";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <div>Home</div>,
  },
  {
    path: "/register",
    element: <Register />,
  },
  { path: "/login", element: <Login /> },
  {
    path: "/seller",
    children: [
      {
        path: "/seller/createProduct",
        element: (
          <Protected role="seller">
            <CreateProduct />
          </Protected>
        ),
      },
      {
        path: "/seller/allProducts",
        element: (
          <Protected role="seller">
            <AllProducts />
          </Protected>
        ),
      },
    ],
  },
]);
