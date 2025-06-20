import { fetchApi } from "@/lib/api.js";

export const login = async (data) => {
  const res = await fetchApi("/api/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
};

export const register = async (data) => {
  const res = await fetchApi("/api/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
};

export const verifyOtp = async (data) => {
  const res = await fetchApi("/api/auth/sent-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
};

export const submitOtp = async (data) => {
  const res = await fetchApi("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
};
