'use client';

import {
    customerListAction,
    deleteCustomerAction,
    saveCustomerAction,
    updateCustomerAction
} from '@/app/actions/customerAction';
import SkeletonList from '@/components/skeleton';
import { useAlert } from '@/context/AlertContext';
import { useApiLoader } from '@/lib/useApiLoader';
import ConfirmDialog from '@components/confirmDialog';
import EmptyState from '@components/emptyState.jsx';
import moment from 'moment';
import { useEffect, useState } from 'react';
import AddCustomer from './addCustomer';

const CustomerList = () => {
    const [openModal, setOpenModal] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState({
        id: null,
        name: '',
        email: '',
        mobile: ''
    });

    const [showDialog, setShowDialog] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState({});
    const [showSkeleton, setShowSkeleton] = useState(false);

    const { start, stop } = useApiLoader();
    const { showAlert } = useAlert();

    useEffect(() => {
        fetchCustomerList();

        return () => {};
    }, []);

    const fetchCustomerList = async () => {
        try {
            setShowSkeleton(true);
            start();
            const res = await customerListAction();
            setCustomers(res.data || []);
            setShowSkeleton(false);
            stop();
            return res?.data || [];
        } catch (err) {
            stop();
            setShowSkeleton(false);
            showAlert(err.message, 'error');
        }
    };

    const editCustomer = (customer) => {
        setOpenModal(true);
        setSelectedCustomer({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            mobile: customer.mobile
        });
    };

    const saveCustomerHandler = async (customer) => {
        try {
            start();
            if (selectedCustomer?.id) {
                const res = await updateCustomerAction({
                    id: selectedCustomer?.id
                });
                setSelectedCustomer({
                    id: null,
                    name: '',
                    email: '',
                    mobile: ''
                });
                showAlert(res.message, 'success');
            } else {
                const res = await saveCustomerAction(customer);
                showAlert(res.message, 'success');
            }

            fetchCustomerList();
            stop();
        } catch (err) {
            stop();
            showAlert(err.message, 'error');
        }
    };

    const deleteCustomerHandler = async (data) => {
        setShowDialog(true);
        setCustomerToDelete(data);
    };

    const openCustomerModal = () => {
        setOpenModal(true);
        setSelectedCustomer({
            id: null,
            name: '',
            email: '',
            mobile: ''
        });
    };

    const handleOk = async () => {
        try {
            start();
            const res = await deleteCustomerAction({ id: customerToDelete?.id });

            if (res.success) {
                const filteredCustomer = customers.filter((cus) => cus.id !== customerToDelete?.id);
                setCustomers(filteredCustomer);

                showAlert(res.message, 'success');
                stop();
            }
            setShowDialog(false);
        } catch (err) {
            showAlert(err.message, 'error');
            stop();
            setShowDialog(false);
            console.log(err);
        }
    };
    const handleCancel = () => {
        setShowDialog(false);
    };

    const handleClose = (val) => {
        setOpenModal(val);
    };
    return (
        <div className="flex flex-col animate-fadeIn p-4">
            <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-md dark:bg-neutral-800 dark:border-neutral-700 overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700 gap-2">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Customers</h2>
                                <p className="text-sm text-gray-500 dark:text-neutral-400">
                                    Add, edit, and manage your customers.
                                </p>
                            </div>
                            <button
                                onClick={openCustomerModal}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-md transition-all duration-200">
                                <span className="material-icons text-base">add</span>
                                Add Customer
                            </button>
                        </div>

                        {/* Table */}
                        {customers.length > 0 && !showSkeleton && (
                            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 text-sm">
                                    <thead className="bg-gray-50 dark:bg-neutral-900 sticky top-0 z-10">
                                        <tr>
                                            {['SL', 'Name', 'Email', 'Mobile', 'Created', 'Actions'].map((col, idx) => (
                                                <th
                                                    key={idx}
                                                    className={`px-6 py-3 text-left font-semibold uppercase tracking-wide text-gray-700 dark:text-neutral-300 ${
                                                        idx === 0 ? 'text-center' : ''
                                                    }`}>
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                                        {customers.map((customer, idx) => (
                                            <tr
                                                className="group hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                                                key={idx}>
                                                <td className="text-start px-6   py-3 font-semibold text-gray-800 dark:text-white">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-3 font-medium text-gray-800 dark:text-white">
                                                    {customer.name || ''}
                                                </td>
                                                <td className="px-6 py-3 text-gray-500 dark:text-neutral-400">
                                                    {customer.email || ''}
                                                </td>
                                                <td className="px-6 py-3 text-gray-500 dark:text-neutral-400">
                                                    {customer.mobile || ''}
                                                </td>
                                                <td className="px-6 py-3 text-gray-500 dark:text-neutral-400">
                                                    {moment(customer.created_at).format('D MMMM YYYY')}
                                                </td>
                                                <td className="px-6 py-3 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => editCustomer(customer)}
                                                        className="material-icons opacity-0 group-hover:opacity-100 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition">
                                                        edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCustomerHandler(customer)}
                                                        className="material-icons opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition">
                                                        delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Table Skeleton */}
                        {showSkeleton && customers.length == 0 && (
                            <div className="p-4">
                                <SkeletonList count={4} />
                            </div>
                        )}
                        {!showSkeleton && customers.length == 0 && <EmptyState />}

                        {/* Footer */}
                        <div className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-t border-gray-200 dark:border-neutral-700">
                            <p className="text-sm text-gray-600 dark:text-neutral-400 pe-1">
                                <span className="font-semibold text-gray-800 dark:text-white pe-1">
                                    {customers?.length || 0}
                                </span>
                                results
                            </p>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Prev
                                </button>
                                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition">
                                    Next
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {openModal && (
                <AddCustomer onClose={handleClose} saveCustomer={saveCustomerHandler} customer={selectedCustomer} />
            )}

            {showDialog && (
                <ConfirmDialog message="Are you sure you want to continue?" onOk={handleOk} onCancel={handleCancel} />
            )}
        </div>
    );
};

export default CustomerList;
