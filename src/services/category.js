import { fetchApi } from "@/lib/api";

export const getCategoryList = async () => {
  const res = await fetchApi("/api/dashboard/categories", {
    method: "GET",
  });
  return res;
};

export const addCategory = async (data) => {
  const res = await fetchApi("/api/dashboard/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res;
};

export const updateCategory = async (data) => {
  const res = await fetchApi("/api/dashboard/categories", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res;
};

export const deleteCategory = async (data) => {
  const res = await fetchApi("/api/dashboard/categories", {
    method: "DELETE",
    body: JSON.stringify(data),
  });
  return res;
};
