import { useDispatch } from "react-redux";
import { createProduct, getProduct } from "../services/product.api";
import { setError, setLoading, setProduct, setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  async function handleCreateProduct(formData) {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const data = await createProduct(formData);
      dispatch(setProduct(data.product));
      return data.product;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create product. Please check your details and try again.";
      dispatch(setError(errorMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetProduct() {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await getProduct();
      dispatch(setSellerProducts(data.products));
      return data.products;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch products. Please try again.";
      dispatch(setError(errorMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }
  return { handleCreateProduct, handleGetProduct };
};
