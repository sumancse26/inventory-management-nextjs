"use client";
import { categoryListAction } from "@/app/actions/categoryAction";
import {
  deleteProductAction,
  productListAction,
} from "@/app/actions/productAction";
import { useAlert } from "@/context/AlertContext";
import { useApiLoader } from "@/lib/useApiLoader";
import { addProduct, updateProduct } from "@/services/product";
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import AddProduct from "./addProduct";

const ProductList = () => {
  const [showModal, setShowModal] = useState(false);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});

  const { start, stop } = useApiLoader();
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchProductList();

    return () => {};
  }, []);

  const fetchCategoryList = async () => {
    try {
      const res = await categoryListAction();
      setCategoryList(res?.data || []);
    } catch (err) {
      showAlert(err.message, "error");
    }
  };
  const fetchProductList = async () => {
    try {
      start();
      const res = await productListAction();
      fetchCategoryList();
      setProductList(res?.data || []);
      stop();
    } catch (err) {
      stop();
      showAlert(err.message, "error");
    }
  };

  const handleSubmit = async (value) => {
    try {
      console.log("value", value);
      let res = "";
      start();
      if (selectedProduct.id) {
        res = await updateProduct(value);
      } else {
        res = await addProduct(value);
      }
      stop();
      if (res.success) {
        showAlert(res.message, "success");
        setShowModal(false);
        fetchProductList();
      }
      return res;
    } catch (err) {
      stop();
      showAlert("Failed to add product", "error");
      return NextResponse.json({
        success: false,
        message: "Failed to add product",
        error: err.message,
      });
    }
  };

  const updateProductHandler = (val) => {
    setSelectedProduct(val);
    setShowModal(true);
  };

  const openProductModal = () => {
    setShowModal(true);
    setSelectedProduct({});
  };

  const deleteProductHandler = async (id) => {
    try {
      start();
      const res = await deleteProductAction(id);
      if (res.success) {
        const filteredList = productList.filter((p) => p.id !== id);
        setProductList(filteredList);
        stop();
        showAlert(res.message, "success");
      }
    } catch (err) {
      console.log(err.message);
      stop();
      showAlert(err.message, "error");
    }
  };

  return (
    <>
      <div className="flex flex-col animate-fadeIn">
        <div className="m-2 overflow-x-auto">
          <div className="p-2 min-w-full inline-block align-middle">
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-md overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 flex flex-col gap-3 md:flex-row md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Products
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Manage your products here.
                  </p>
                </div>

                <button
                  onClick={openProductModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                >
                  <span className="material-icons text-base">add</span>
                  Add Product
                </button>
              </div>

              {/* Table */}
              <div className="overflow-auto max-h-[calc(100vh-300px)]">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 text-sm">
                  <thead className="bg-gray-50 dark:bg-neutral-700">
                    <tr>
                      <th>
                        <span className="font-semibold text-xs uppercase tracking-wider text-gray-800 dark:text-neutral-200">
                          SL
                        </span>
                      </th>
                      <th className="px-1 py-2 font-semibold text-xs uppercase tracking-wider text-gray-800 dark:text-neutral-200 text-start">
                        Image
                      </th>
                      <th className="px-1 py-2 font-semibold text-xs uppercase tracking-wider text-gray-800 dark:text-neutral-200  text-start">
                        Name
                      </th>
                      <th className="px-1 py-2 font-semibold text-xs uppercase tracking-wider text-gray-800 dark:text-neutral-200  text-end">
                        Price (TK)
                      </th>
                      <th className="px-1 py-2 font-semibold text-xs uppercase tracking-wider text-gray-800 dark:text-neutral-200  text-end">
                        Stock
                      </th>
                      <th className="px-1 py-2 font-semibold text-xs uppercase tracking-wider text-gray-800 dark:text-neutral-200  text-center">
                        VAT (%)
                      </th>
                      <th className="px-1 py-2 font-semibold text-xs uppercase tracking-wider text-gray-800 dark:text-neutral-200  text-end">
                        Discount (TK)
                      </th>
                      <th className="px-1 py-2 font-semibold text-xs uppercase tracking-wider text-gray-800 dark:text-neutral-200">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                    {productList.map((product, indx) => (
                      <tr
                        className="group hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                        key={indx}
                      >
                        <td className="text-center px-6 py-3 font-medium text-gray-800 dark:text-white">
                          {indx + 1}
                        </td>
                        <td className="px-1 py-2 text-start">
                          {product?.img_url != "" ? (
                            <img
                              src={product?.img_url || null}
                              alt="Product"
                              className="w-10 h-10 rounded-md bg-gray-100"
                            />
                          ) : (
                            ""
                          )}
                        </td>
                        <td className="px-1 py-2 text-gray-600 dark:text-neutral-300  text-start">
                          {product?.name || ""}
                        </td>
                        <td className="px-1 py-2 text-gray-600 dark:text-neutral-300 text-end">
                          {product.price || 0}
                        </td>
                        <td className="px-1 py-2 text-gray-600 dark:text-neutral-300 text-end">
                          {product.stock || 0} {product.uom_name || ""}
                        </td>
                        <td className="px-1 py-2 text-gray-600 dark:text-neutral-300 text-center">
                          {product.vat_pct || 0}
                        </td>
                        <td className="px-1 py-2 text-gray-600 dark:text-neutral-300 text-end">
                          {product.discount || 0}
                        </td>
                        <td className="px-1 py-2 flex justify-end gap-2">
                          <button
                            onClick={() => updateProductHandler(product)}
                            className="material-icons opacity-0 group-hover:opacity-100 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                          >
                            edit
                          </button>
                          <button
                            onClick={() => deleteProductHandler(product.id)}
                            className="material-icons opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                          >
                            delete
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Add more rows as needed */}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex flex-col gap-3 md:flex-row md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    <span className="font-semibold text-gray-800 dark:text-white pe-1">
                      {productList.length || 0}
                    </span>
                    results
                  </p>
                </div>

                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 inline-flex items-center gap-x-1 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Prev
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 inline-flex items-center gap-x-1 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-600"
                  >
                    Next
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AddProduct
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          categoryList={categoryList}
          handleSubmit={handleSubmit}
          selectedProduct={selectedProduct}
        />
      )}
    </>
  );
};

export default ProductList;
