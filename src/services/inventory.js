import { fetchApi } from "@/lib/api.js";

export const login = async (data) => {
  const res = await fetchApi("/api/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
};
