"use client";

import {
  addCategoryAction,
  categoryListAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/actions/categoryAction";
import { useAlert } from "@/context/AlertContext";
import { useApiLoader } from "@/lib/useApiLoader";
import moment from "moment";
import { useEffect, useState } from "react";
import AddCategory from "./addCategory";

const CategoryList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});

  const { start, stop } = useApiLoader();
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchCategoryList();

    return () => {};
  }, []);

  const fetchCategoryList = async () => {
    try {
      start();
      const res = await categoryListAction();
      setCategories(res?.data || []);
      stop();
    } catch (err) {
      stop();
      showAlert(err.message, "error");
    }
  };

  const saveCategoryHandler = async (category) => {
    try {
      start();
      if (selectedCategory?.id) {
        const res = await updateCategoryAction({
          name: category,
          id: selectedCategory?.id,
        });
        showAlert(res.message, "success");
      } else {
        const res = await addCategoryAction({ name: category });
        showAlert(res.message, "success");
      }
      setOpenModal(false);
      fetchCategoryList();
      stop();
    } catch (err) {
      showAlert(err.message, "error");
      stop();
    }
  };

  const editCategoryHandler = async (category) => {
    setSelectedCategory(category);
    setOpenModal(true);
  };

  const deleteCategoryHandler = async (category) => {
    try {
      start();
      const res = await deleteCategoryAction(category?.id);
      showAlert(res.message, "success");
      if (res.success) {
        const filteredList = categories.filter((c) => c.id !== category?.id);
        setCategories(filteredList);
      }
      stop();
    } catch (err) {
      stop();
      console.error("Error deleting category:", err);
    }
  };

  const openModalHandler = () => {
    setSelectedCategory({});
    setOpenModal(true);
  };
  const hideModalHandler = (val) => {
    setSelectedCategory({});
    setOpenModal(val);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="m-2 overflow-x-auto">
          <div className="p-2 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-md dark:bg-neutral-800 dark:border-neutral-700">
              {/* Header */}
              <div className="px-6 py-4 flex flex-col md:flex-row justify-between md:items-center border-b border-gray-200 dark:border-neutral-700 gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-100">
                    Categories
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    Manage, add, and update categories.
                  </p>
                </div>

                <button
                  onClick={openModalHandler}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded hover:from-blue-600 hover:to-purple-700 focus:outline-none"
                >
                  <span className="material-icons text-base">add</span>
                  Add Category
                </button>
              </div>

              {/* Table */}
              <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-900">
                    <tr className="group hover:bg-gray-50 dark:hover:bg-neutral-700 transition">
                      <th className="text-center px-4 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-neutral-300">
                        SL
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-neutral-300">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-neutral-300">
                        Created
                      </th>
                      <th className="text-right px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {categories.map((category, index) => (
                      <tr
                        className="hover:bg-gray-50 dark:hover:bg-neutral-700 group transition"
                        key={index}
                      >
                        <td className="text-center px-4 py-3 text-sm font-semibold text-gray-800 dark:text-neutral-200">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-neutral-200">
                          {category.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-neutral-400">
                          {moment(category.created_at).format("D MMMM YYYY")}
                        </td>
                        <td className="px-4 py-3 flex justify-end gap-2">
                          <button
                            onClick={() => editCategoryHandler(category)}
                            className="material-icons opacity-0 group-hover:opacity-100 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                          >
                            edit
                          </button>
                          <button
                            onClick={() => deleteCategoryHandler(category)}
                            className="material-icons opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                          >
                            delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-3 border-t border-gray-200 dark:border-neutral-700">
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  <span className="font-semibold text-gray-800 dark:text-neutral-200 pe-1">
                    {categories?.length || 0}
                  </span>
                  results
                </p>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700">
                    <span className="material-icons text-sm">chevron_left</span>
                    Prev
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-100 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700">
                    Next
                    <span className="material-icons text-sm">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {openModal && (
          <AddCategory
            category={selectedCategory}
            saveCategory={saveCategoryHandler}
            hideModal={hideModalHandler}
          />
        )}
      </div>
    </>
  );
};

export default CategoryList;
