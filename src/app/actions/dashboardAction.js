"use server";
import { dashboardInfo } from "@/services/dashboard.js";

export const dashboardAction = async (data) => {
  const res = await dashboardInfo(data);

  return res;
};
