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
  const res = await fetchApi("/api/sent-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
};

export const submitOtp = async (data) => {
  const res = await fetchApi("/api/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
};

export const doLogout = async () => {
  const res = await fetchApi("/api/auth/logout", {
    method: "GET",
  });

  return res;
};

export const getProfile = async () => {
  const res = await fetchApi("/api/auth/profile", {
    method: "GET",
  });

  return res;
};

export const updateProfile = async (data) => {
  const res = await fetchApi("/api/auth/profile", {
    method: "POST",
    body: data,
  });

  return res;
};
