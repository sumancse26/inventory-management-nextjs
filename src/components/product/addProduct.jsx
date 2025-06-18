"use client";

import { useState } from "react";
import { CSSTransition } from "react-transition-group";

const AddProduct = ({ isOpen, onClose }) => {
  const [productInfo, setProductInfo] = useState({ image: null });

  return (
    <CSSTransition in={isOpen} timeout={300} classNames="modal" unmountOnExit>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal */}
        <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300 ease-in-out dark:bg-neutral-800">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">
            Create New Product
          </h2>

          <form className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              >
                <option>Select Category</option>
                <option>Electronics</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <input
                type="text"
                name="price"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unit
              </label>
              <input
                type="text"
                name="unit"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Image
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300">
                  {productInfo.image ? (
                    <img
                      src=""
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-600 dark:text-gray-300"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </CSSTransition>
  );
};

export default AddProduct;
