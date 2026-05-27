import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "/api/",
  withCredentials: true,
});

export async function createProduct(formData) {

  const res = await productApiInstance.post("prod/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(res);
  return res.data;
}

export async function getProduct() {
  const res = await productApiInstance.get("prod/get-all");
  return res.data;
}
