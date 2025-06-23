import { fetchApi } from "@/lib/api";

export const getProductList = async () => {
  const res = await fetchApi("/api/dashboard/products", {
    method: "GET",
  });
  return res;
};

export const addProduct = async (data) => {
  const res = await fetchApi("/api/dashboard/products", {
    method: "POST",
    body: data,
  });
  return res;
};

export const updateProduct = async (data) => {
  const res = await fetchApi("/api/dashboard/products", {
    method: "PUT",
    body: data,
  });
  return res;
};

export const deleteProduct = async (id) => {
  const res = await fetchApi("/api/dashboard/products", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  return res;
};
