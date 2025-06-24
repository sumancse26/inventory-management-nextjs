"use server";
import { confirmSale } from "@/services/sale.js";

export const confirmSaleAction = async () => {
  const res = await confirmSale();

  return res;
};
