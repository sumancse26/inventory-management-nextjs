"use server";
import { deleteProduct, getProductList } from "@/services/product.js";

export const productListAction = async () => {
  const res = await getProductList();

  return res;
};

export const deleteProductAction = async (id) => {
  const res = await deleteProduct(id);

  return res;
};
