"use server";
import { login } from "@/services/inventory";
export const loginAction = async (prevState, formData) => {
  if (!formData) return prevState;

  const email = formData.get("email");
  const password = formData.get("password");
  const result = await login({ email, password });
  console.log("server action", result);
};
