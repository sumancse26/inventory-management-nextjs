'use client';

import Loader from '@components/loader';
import { useEffect, useState } from 'react';
const AddCategory = (props) => {
    const [name, setName] = useState('');
    const [loadingState, setLoadingState] = useState(false);

    useEffect(() => {
        setName(props.category?.name || '');
    }, [props.category?.name]);

    const closeModal = () => {
        props.hideModal(false);
    };

    const submitCategory = async (e) => {
        e.preventDefault();

        setLoadingState(true);
        await props.saveCategory(name);
        setLoadingState(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6 animate-fadeIn">
                {/* Close Button */}
                <div className="flex justify-between items-center border-b border-gray-400 py-2">
                    {/* Modal Title */}
                    <h5 className="text-xl font-bold text-gray-800 dark:text-white mt-[-20px]">Add Category</h5>
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white transition"
                        aria-label="Close">
                        <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2">
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form className="space-y-5 py-3" onSubmit={submitCategory}>
                    <div className="h-[130px] border-b border-gray-400 mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:placeholder:text-neutral-400"
                            placeholder="e.g. Electronics"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-3 pt-2">
                        <button
                            onClick={closeModal}
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600 dark:focus:ring-neutral-500">
                            Cancel
                        </button>

                        <button
                            disabled={loadingState}
                            type="submit"
                            className="px-5 py-2 flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md shadow hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                            Save {loadingState && <Loader />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
