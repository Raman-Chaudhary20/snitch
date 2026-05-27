import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    product: null,
    loading: false,
    error: null,
    sellerProducts:[]
  },
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSellerProducts:(state, action)=>{
        state.sellerProducts = action.payload
    }
  },
});

export const {setError,setLoading,setProduct, setSellerProducts} = productSlice.actions;
export default productSlice.reducer;
