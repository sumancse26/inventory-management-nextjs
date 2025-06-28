import Loader from '@components/loader';
import { useEffect, useState } from 'react';

const AddCustomer = ({ onClose, saveCustomer, customer }) => {
    const [customerInfo, setCustomerInfo] = useState({
        id: null,
        name: '',
        email: '',
        mobile: ''
    });
    const [loadingState, setLoadingState] = useState(false);

    useEffect(() => {
        setCustomerInfo(customer);
    }, [customer]);

    const saveBtnHandler = async () => {
        setLoadingState(true);
        await saveCustomer(customerInfo);
        setLoadingState(false);
        onClose(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative transform transition-all duration-300 scale-100 animate-fadeIn">
                {/* Close Button */}
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
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                    {customerInfo.id ? 'Update' : 'Add New'} Customer
                </h2>

                {/* Form */}
                <form className="space-y-4" onSubmit={saveBtnHandler}>
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Customer Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={customerInfo.name}
                            required
                            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                            placeholder="Enter full name"
                            className="w-full px-4 py-2 text-sm border rounded-lg border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Customer Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                            placeholder="example@domain.com"
                            className="w-full px-4 py-2 text-sm border rounded-lg border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Mobile Number <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={customerInfo.mobile}
                            required
                            onChange={(e) => setCustomerInfo({ ...customerInfo, mobile: e.target.value })}
                            placeholder="01XXXXXXXXX"
                            className="w-full px-4 py-2 text-sm border rounded-lg border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 justify-center">
                        <button
                            onClick={() => onClose(false)}
                            type="button"
                            className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600 dark:focus:ring-neutral-500 transition">
                            Cancel
                        </button>
                        <button
                            disabled={loadingState}
                            type="submit"
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                            Save {loadingState && <Loader />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomer;
