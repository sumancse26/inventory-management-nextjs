"use client";

import { customerListAction } from "@/app/actions/customerAction";
import { productListAction } from "@/app/actions/productAction";
import SearchableDropdown from "@/components/searchableDropdown";
import { useAlert } from "@/context/AlertContext";
import { useEffect, useState } from "react";

const Sale = () => {
  const [customerList, setCustomerList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [addedProduct, setAddedProduct] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});

  const { showAlert } = useAlert();

  useEffect(() => {
    getCustomerList();
    getProductList();

    return () => {};
  }, []);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const getCustomerList = async () => {
    try {
      const res = await customerListAction();
      setCustomerList(res.data || []);
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const getProductList = async () => {
    try {
      const res = await productListAction();

      setProductList(res.data || []);
      setFilteredProduct(res.data || []);
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const searchProduct = (e) => {
    const searchKey = e.target.value;

    if (searchKey || searchKey == "") {
      const searchedProduct = productList?.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchKey?.toLowerCase())
        )
      );

      setFilteredProduct(searchedProduct);
    } else {
      setProductList(productList);
    }
  };

  const addProductHandler = (val) => {
    setAddedProduct((prev) => [...prev, val]);
  };

  const subTotal = () => {
    return addedProduct.reduce(
      (total, item) => total + Number(item.item_total || 0),
      0
    );
  };

  const totalPayable = () => {
    return subTotal() - discountTotal() + totalVat();
  };

  const discountTotal = () => {
    return addedProduct.reduce((total, item) => {
      return total + Number(item.discount || 0) || 0;
    }, 0);
  };

  const totalVat = () => {
    return addedProduct.reduce((total, item) => {
      return (
        total + ((Number(item.item_total) * Number(item.vat_pct)) / 100 || 0)
      );
    }, 0);
  };

  const itemTotalHandler = (e, item) => {
    const { value } = e.target;
    const updatedProduct = addedProduct.map((prod) => {
      if (prod.id === item.id) {
        return { ...prod, item_total: Number(value) * Number(prod.price) };
      }
      return prod;
    });
    setAddedProduct(updatedProduct);
  };
  const confirmSaleHandler = async () => {
    try {
      const data = {
        customer_id: selectedCustomer.id,
        total: subTotal(),
        discount: discountTotal() || 0,
        vat_pct: totalVat() || 0,
        payable: totalPayable() || 0,
        products: addedProduct?.map((prod) => {
          return {
            product_id: prod.id,
            qty: prod.qty,
            sale_price: prod.price || 0,
          };
        }),
      };

      console.log("data", data);
      showAlert("Sale Confirmed", "success");
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  return (
    <div className="container mx-auto p-4 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-150px)]">
        {/* Invoice Section (7 of 12 columns) */}
        <div className="col-span-12 md:col-span-8 bg-white shadow-xl rounded-2xl p-6 animate-fadeIn flex flex-col">
          <div className="flex justify-between items-start border-b border-gray-300 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                Billed To
              </h2>
              <p className="text-sm text-gray-600">
                Name:{" "}
                <span className="text-indigo-700">
                  {selectedCustomer.name || ""}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Email:{" "}
                <span className="text-indigo-700">
                  {selectedCustomer.email || ""}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Phone:{" "}
                <span className="text-indigo-700">
                  {selectedCustomer.mobile || ""}
                </span>
              </p>
            </div>
            <div className="text-center">
              <img className="w-14 mx-auto" src="/images/logo.png" alt="Logo" />
              <p className="font-semibold text-gray-700 mt-2">Invoice</p>
            </div>
          </div>

          <div className="flex-1 overflow-auto my-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-600 border-b border-gray-300">
                  <th className="w-1/12 px-2 py-1">SL</th>
                  <th className="w-3/12 px-2 py-1">Name</th>
                  <th className="w-2/12 px-2 py-1 text-end">Stock</th>
                  <th className="w-2/12 px-2 py-1 text-end">Price</th>
                  <th className="w-1/12 px-2 py-1">Qty</th>
                  <th className="w-1/12 px-2 py-1 text-center">VAT</th>
                  <th className="w-1/12 px-2 py-1 text-center">Discount</th>
                  <th className="w-2/12 px-2 py-1 text-right">Total</th>
                  <th className="w-1/12"></th>
                </tr>
              </thead>
              <tbody>
                {addedProduct.map((addedProd, addedIndx) => (
                  <tr
                    className="border-b border-gray-300 hover:bg-gray-50 group"
                    key={addedIndx}
                  >
                    <td className="px-2 py-2">{addedIndx + 1}</td>
                    <td className="px-2 py-2">{addedProd.name || ""}</td>
                    <td className="px-2 py-2 text-end">
                      {addedProd.stock || 0}
                    </td>
                    <td className="px-2 py-2 text-end">
                      {addedProd.price || 0}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        onChange={(e) => itemTotalHandler(e, addedProd)}
                        type="number"
                        min="0"
                        className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-purple-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white transition"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      {addedProd.vat_pct}
                    </td>
                    <td className="px-2 py-2 text-center">
                      {addedProd.discount}
                    </td>

                    <td className="px-2 py-2 text-right">
                      {addedProd.item_total || 0}
                    </td>
                    <td className="text-center">
                      <button className="bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition">
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-300 pt-4 space-y-2 text-sm text-gray-700">
            <p>
              Sub Total:
              <span className="text-indigo-700">{subTotal()} TK.</span>
            </p>
            <p>
              Payable:{" "}
              <span className="text-indigo-700">{totalPayable()} TK.</span>
            </p>
            <p>
              VAT:
              <span className="text-indigo-700">{totalVat()} TK.</span>
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="discount" className="w-24">
                Discount:
              </label>
              <input
                type="number"
                id="discount"
                className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              />
            </div>
            <button
              onClick={confirmSaleHandler}
              className="w-full py-2 mt-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 transition-transform"
            >
              Confirm
            </button>
          </div>
        </div>

        {/* Product Section (5 of 12 columns) */}
        <div className="col-span-12 md:col-span-4 bg-white shadow-xl rounded-2xl p-6 animate-fadeIn flex flex-col">
          <div className="flex">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Products</h3>
            <div className="ml-auto mb-2">
              <SearchableDropdown
                options={customerList}
                onSelect={handleCustomerSelect}
                labelKey="name"
                valueKey="mobile"
                placeholder="Search customer by name or mobile"
              />
            </div>
          </div>
          <input
            onChange={(e) => searchProduct(e)}
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
          />
          <div className="flex-1 overflow-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b border-gray-300">
                  <th className="w-1/12 px-2 py-1">SL</th>
                  <th className="w-6/12 px-2 py-1 text-start">Name</th>
                  <th className="w-2/12 px-2 py-1 text-end">Price</th>
                  <th className="w-2/12 px-2 py-1 text-end">Stock</th>
                  <th className="w-1/12 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProduct?.map((prod, prodIndx) => (
                  <tr
                    className="border-b border-gray-300 hover:bg-gray-50"
                    key={prodIndx}
                  >
                    <td className="px-2 py-2">{prodIndx + 1}</td>
                    <td className="px-2 py-2 text-start">{prod.name || ""}</td>
                    <td className="px-2 py-2 text-end">{prod.price || 0}</td>
                    <td className="px-2 py-2 text-end">{prod.qty || 0}</td>
                    <td className="px-2 py-2 text-end">
                      <button
                        onClick={() => addProductHandler(prod)}
                        className="text-purple-600 bg-purple-100 px-3 py-1 rounded-full hover:bg-purple-200"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-4">
            <button className="hover:underline">Previous</button>
            <button className="hover:underline">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sale;
