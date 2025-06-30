'use client';

import {
    collectionAction,
    deleteInvoiceAction,
    invoiceInfoAction,
    invoiceListAction
} from '@/app/actions/invoiceAction';
import SkeletonList from '@/components/skeleton';
import { useDialog } from '@/context/DialogContext';
import { useApiLoader } from '@/lib/useApiLoader';
import EmptyState from '@components/emptyState.jsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Collection from './collection';
import InvoiceDetail from './invoiceDetails';

const InvoiceList = () => {
    const [invoiceList, setInvoiceList] = useState([]);
    const [showInvDtl, setShowInvDtl] = useState(false);
    const [invInfo, setInvInfo] = useState({});
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [showCollection, setShowCollection] = useState(false);
    const [selectedInv, setSelectedInv] = useState({});

    const { start, stop } = useApiLoader();
    const { openDialog } = useDialog();

    useEffect(() => {
        getInvListHandler();

        return () => {};
    }, []);

    const getInvListHandler = async () => {
        try {
            setShowSkeleton(true);
            start();
            const res = await invoiceListAction();
            setInvoiceList(res.data || []);
            setShowSkeleton(false);
            stop();
        } catch (err) {
            setShowSkeleton(false);
            stop();
            console.log(err.message);
        }
    };

    const getInvById = async (data) => {
        try {
            const res = await invoiceInfoAction(data.id);
            setInvInfo(res.invoiceInfo || {});
        } catch (err) {
            console.log(err.message);
        }
    };

    const viewInvHandler = async (data) => {
        await getInvById(data);
        setShowInvDtl(true);
    };

    const closeModalHandler = () => {
        setShowInvDtl(false);
    };

    const collectionInvoiceHandler = (inv) => {
        setSelectedInv(inv);
        setShowCollection(true);
    };

    const onCloseCollection = () => {
        setShowCollection(false);
    };

    const saveCollectionHandler = async (val) => {
        try {
            const data = {
                invoice_id: val.invoice_id,
                collection_amount: val.collection_amount
            };
            await openDialog('You want to save ?', { type: 'confirm' });
            start();
            const res = await collectionAction(data);

            if (res.success) {
                await openDialog(res.message, { type: 'success' });

                setShowCollection(false);
                getInvListHandler();
            } else {
                await openDialog(res.message, { type: 'error' });
            }
            stop();
        } catch (err) {
            stop();
            console.log(err.message);
        }
    };

    const cancelInvoice = async (inv) => {
        try {
            await openDialog('You want to cancel ?', { type: 'confirm' });
            start();

            const res = await deleteInvoiceAction({ invoice_id: inv.id });
            if (res.success) {
                await openDialog(res.message, { type: 'success' });
                getInvListHandler();
            } else {
                await openDialog(res.message, { type: 'error' });
            }
            stop();
        } catch (err) {
            stop();
            console.log(err.message);
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-indigo-600">
                    <span className="material-icons text-3xl">receipt_long</span>
                    <h2 className="text-2xl font-bold text-gray-800">Invoice List</h2>
                </div>
                <Link
                    href="/dashboard/sale"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded hover:from-blue-600 hover:to-purple-700 focus:outline-none">
                    <span className="material-icons">switch_access_shortcut</span>
                    Back to sale
                </Link>
            </div>

            {/* Table */}
            {invoiceList?.length > 0 && !showSkeleton && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                            <tr>
                                <th className="px-5 py-3 font-semibold">SL</th>
                                <th className="px-5 py-3 font-semibold">Inv No</th>
                                <th className="px-5 py-3 font-semibold">Inv By</th>
                                <th className="px-5 py-3 font-semibold text-end">Discount</th>
                                <th className="px-5 py-3 font-semibold text-end">Vat Amount</th>
                                <th className="px-5 py-3 font-semibold text-end">Inv Total</th>
                                <th className="px-5 py-3 font-semibold text-end">Collection</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3 font-semibold text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {invoiceList?.map((inv, indx) => (
                                <tr key={indx} className="hover:bg-gray-50 dark:hover:bg-neutral-700 group transition">
                                    <td className="px-5 py-3 text-gray-700">{indx + 1}</td>
                                    <td className="px-5 py-3 text-gray-700">{inv.inv_no || ''}</td>
                                    <td className="px-5 py-3 text-gray-700">
                                        {inv?.user?.first_name || ''} {inv?.user?.last_name || ''}
                                    </td>
                                    <td className="px-5 py-3 text-gray-700 text-end">{inv?.discount || 0}</td>
                                    <td className="px-5 py-3 text-gray-700 text-end">{inv?.vat_amount || 0}</td>
                                    <td className="px-5 py-3 text-gray-700 text-end">{inv?.payable || 0}</td>
                                    <td className="px-5 py-3 text-gray-700 text-end">{inv?.collection_amount || 0}</td>
                                    <td className="px-5 py-3 text-gray-700">
                                        {inv.status == 1 ? 'active' : inv.status == 2 ? 'inactive' : 'cancelled'}
                                    </td>
                                    <td className="px-5 py-3 flex items-end justify-end gap-3 text-end">
                                        {inv.collection_type != 'full' && (
                                            <button
                                                onClick={() => collectionInvoiceHandler(inv)}
                                                className="material-icons opacity-0 group-hover:opacity-100 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                                                title="collection">
                                                <span className="material-symbols-outlined">money</span>
                                            </button>
                                        )}

                                        <button
                                            onClick={() => viewInvHandler(inv)}
                                            className="material-icons opacity-0 group-hover:opacity-100 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                                            title="View">
                                            <span className="material-icons text-sm">visibility</span>
                                        </button>
                                        {inv.collection_amount == 0 && (
                                            <button
                                                onClick={() => cancelInvoice(inv)}
                                                className="material-icons opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                                                title="Delete">
                                                <span className="material-icons text-sm">delete</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Table Skeleton */}
            {showSkeleton && invoiceList.length == 0 && (
                <div className="p-4">
                    <SkeletonList count={4} />
                </div>
            )}
            {!showSkeleton && invoiceList.length == 0 && <EmptyState />}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                <p>
                    Showing <span className="font-bold">{invoiceList?.length || 0}</span> entries
                </p>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50">
                        <span className="material-icons text-sm">chevron_left</span>
                        Prev
                    </button>
                    <button className="flex items-center gap-1 px-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50">
                        Next
                        <span className="material-icons text-sm">chevron_right</span>
                    </button>
                </div>
            </div>

            {showInvDtl && <InvoiceDetail closeModalHandler={closeModalHandler} invInfo={invInfo} />}
            {showCollection && (
                <Collection
                    onClose={onCloseCollection}
                    selectedInv={selectedInv}
                    saveCollection={saveCollectionHandler}
                />
            )}
        </div>
    );
};

export default InvoiceList;
