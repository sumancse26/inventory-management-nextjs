import { useState } from 'react';

const Collection = ({ selectedInv, onClose, saveCollection }) => {
    const [collection, setCollection] = useState('');
    const collectionHandler = (e) => {
        e.preventDefault();

        saveCollection({ collection_amount: collection, invoice_id: selectedInv.id });
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative transform transition-all duration-300 scale-100 animate-fadeIn">
                {/* Close Button */}
                <div className="border-b border-gray-300 mb-6">
                    <button
                        onClick={() => onClose(false)}
                        type="button"
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}>
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-600 dark:text-white pb-3">Collection Info</h2>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={collectionHandler}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Invoice No:
                        </label>
                        <input
                            value={selectedInv.inv_no}
                            type="text"
                            name="name"
                            placeholder="Invoice"
                            readOnly
                            className="w-full px-4 py-2 text-sm border rounded-lg border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Total Due (TK.):
                        </label>
                        <input
                            value={Number(selectedInv.payable) - Number(selectedInv.collection_amount)}
                            type="text"
                            name="name"
                            placeholder="Due"
                            readOnly
                            className="w-full px-4 py-2 text-sm border rounded-lg border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Collection Amount: <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            onChange={(e) => setCollection(e.target.value)}
                            type="number"
                            name="collection_amount"
                            placeholder="Collection Amount"
                            className="w-full px-4 py-2 text-sm border rounded-lg border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 justify-center border-t border-gray-300">
                        <button
                            onClick={() => onClose(false)}
                            type="button"
                            className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600 dark:focus:ring-neutral-500 transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                            Make Collection
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Collection;
