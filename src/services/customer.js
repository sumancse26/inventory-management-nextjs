import { fetchApi } from "@/lib/api";

export const getCustomerList = async () => {
  const res = await fetchApi("/api/dashboard/customers", {
    method: "GET",
  });
  return res;
};

export const addCustomer = async (data) => {
  const res = await fetchApi("/api/dashboard/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res;
};

export const updateCustomer = async (data) => {
  const res = await fetchApi("/api/dashboard/customers", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res;
};

export const deleteCustomer = async (data) => {
  const res = await fetchApi("/api/dashboard/customers", {
    method: "DELETE",
    body: JSON.stringify(data),
  });
  return res;
};
