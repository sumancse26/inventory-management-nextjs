"use client";

import { useAlert } from "@/context/AlertContext";
import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";

const AddProduct = ({
  isOpen,
  onClose,
  categoryList,
  handleSubmit,
  selectedProduct,
}) => {
  const [productInfo, setProductInfo] = useState({
    name: "",
    price: "",
    unit: "",
    image: "",
    qty: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");

  const { showAlert } = useAlert();

  useEffect(() => {
    if (selectedProduct && Object.keys(selectedProduct).length > 0) {
      setProductInfo({
        name: selectedProduct.name || "",
        price: selectedProduct.price || 0,
        unit: selectedProduct.unit || "",
        image: selectedProduct.image || "",
        category_id: selectedProduct.category_id || "",
        qty: selectedProduct.qty || 0,
      });
      setCategory(selectedProduct.category_id);
      if (selectedProduct.img_url) {
        setPreview(selectedProduct.img_url);
        setProductImage(selectedProduct.img_url);
      }
    } else {
      setProductInfo({
        name: "",
        price: 0,
        unit: "",
        image: "",
        qty: 0,
      });
      setProductImage(null);
      setPreview(null);
    }
  }, [selectedProduct]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("id", selectedProduct.id);
    data.append("name", productInfo.name);
    data.append("price", productInfo.price);
    data.append("unit", productInfo.unit);
    data.append("category_id", category);
    data.append("qty", productInfo.qty);

    if (productImage) {
      data.append("image", productImage);
    }
    if (
      !productInfo.name ||
      productInfo.price <= 0 ||
      !category ||
      productInfo.qty <= 0
    ) {
      showAlert("Fill all the fields", "error");
      return;
    }

    const res = await handleSubmit(data);
    if (res.success) {
      setProductInfo({
        name: "",
        price: "",
        unit: "",
        image: "",
        qty: "",
      });
      setProductImage(null);
      setPreview(null);
      setCategory("");
    }
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setCategory(value);
  };

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

          <form className="space-y-5" onSubmit={submitForm}>
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                className="w-full px-4 py-2 outline-none border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-neutral-700 dark:text-white"
                onChange={handleCategoryChange}
                required
                value={category}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categoryList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={productInfo.name}
                onChange={handleInputChange}
                required
                placeholder="Enter Product Name"
                className="w-full px-4 py-2 outline-none border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="price"
                value={productInfo.price}
                onChange={handleInputChange}
                required
                placeholder="Enter Product Price"
                className="w-full px-4 py-2 outline-none border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Qty <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="qty"
                value={productInfo.qty}
                onChange={handleInputChange}
                required
                placeholder="Enter Product Quantity"
                className="w-full px-4 py-2 outline-none border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Image <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {/* Clickable preview box */}
                <label
                  htmlFor="product-image"
                  className="cursor-pointer w-20 h-20 bg-gray-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300 relative group"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 text-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mb-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 16l4-4-4-4m0 8V8a2 2 0 012-2h14m-4 4l4 4-4 4"
                        />
                      </svg>
                      <span>Upload</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </label>
                {/* File name display */}
                <div className="flex-1 text-sm text-gray-700 dark:text-gray-300 break-all">
                  {productImage?.name ? <span>{productImage.name}</span> : ""}
                </div>
                <input
                  id="product-image"
                  type="file"
                  name="image"
                  required
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-2 pt-4  border-t-2 border-gray-500">
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
