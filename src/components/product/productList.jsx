"use client";
import { useState } from "react";
import AddProduct from "./addProduct";
const ProductList = () => {
  const [showModal, setShowModal] = useState(false);
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
                  onClick={() => setShowModal(true)}
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
                      {["SL", "Image", "Name", "Price", "Unit"].map(
                        (heading, idx) => (
                          <th
                            key={idx}
                            className={`px-6 py-3 ${
                              idx === 0
                                ? "text-center"
                                : idx === 5
                                ? "text-end"
                                : "text-left"
                            }`}
                          >
                            <span className="font-semibold text-xs uppercase tracking-wider text-gray-800 dark:text-neutral-200">
                              {heading}
                            </span>
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                    <tr className="group hover:bg-gray-50 dark:hover:bg-neutral-700 transition">
                      <td className="text-center px-6 py-3 font-medium text-gray-800 dark:text-white">
                        1
                      </td>
                      <td className="px-6 py-3">
                        <img
                          src=""
                          alt="Product"
                          className="w-10 h-10 rounded-md bg-gray-100"
                        />
                      </td>
                      <td className="px-6 py-3 text-gray-600 dark:text-neutral-300">
                        Sample Product
                      </td>
                      <td className="px-6 py-3 text-gray-600 dark:text-neutral-300">
                        12345
                      </td>
                      <td className="px-6 py-3 text-gray-600 dark:text-neutral-300">
                        kg
                      </td>
                      <td className="px-6 py-3 flex justify-end gap-2">
                        <button className="material-icons opacity-0 group-hover:opacity-100 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition">
                          edit
                        </button>
                        <button className="material-icons opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition">
                          delete
                        </button>
                      </td>
                    </tr>
                    {/* Add more rows as needed */}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex flex-col gap-3 md:flex-row md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    Showing
                    <span className="font-semibold text-gray-800 dark:text-white">
                      12
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
        <AddProduct isOpen={showModal} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default ProductList;
