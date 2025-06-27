import { fetchApi } from "@/lib/api.js";

export const dashboardInfo = async () => {
  const res = await fetchApi("/api/dashboard", {
    method: "GET",
  });

  return res;
};
