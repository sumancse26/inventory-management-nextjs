'use client';

import SkeletonList from '@/components/skeleton';
import moment from 'moment';
import Image from 'next/image';

const InvoiceDetail = ({ closeModalHandler, invInfo, invDtlSkeleton }) => {
    const closeBtnHandler = () => {
        closeModalHandler();
    };

    const printBtnHandler = () => {
        window.print();
        closeModalHandler();
    };
    return (
        <div
            id="details-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                id="printable"
                className="bg-white dark:bg-gray-400 rounded-2xl shadow-xl w-full max-w-4xl mx-auto animate-zoomIn print:shadow-none print:rounded-none">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-400 print:hidden">
                    <h2 className="text-xl font-semibold text-gray-600 dark:text-white">Invoice</h2>
                    <button
                        onClick={closeBtnHandler}
                        type="button"
                        className="text-gray-500 hover:text-red-500 transition">
                        &times;
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto" id="invoice">
                    <div className="flex  justify-between items-start print:flex print:justify-between">
                        <div>
                            <p className="text-sm font-bold text-gray-800 dark:text-white">BILLED TO</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Name:
                                <span id="CName" className="font-bold">
                                    {invInfo.customer?.name || ''}
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Email:
                                <span id="CEmail" className="font-bold">
                                    {invInfo.customer?.email || ''}
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Phone:
                                <span id="CId" className="font-bold">
                                    {invInfo.customer?.mobile || ''}
                                </span>
                            </p>
                        </div>

                        {/* RIGHT SECTION */}
                        <div className="md:w-auto text-right">
                            <Image
                                src="/uploads/logo.png"
                                alt="Logo"
                                width={80}
                                height={40}
                                priority
                                className="ml-auto print:ml-auto print:mr-0"
                            />
                            <p className="text-sm font-semibold text-gray-800 dark:text-white mt-2">Invoice</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Date:
                                <span className="font-bold">
                                    {moment(invInfo.created_at).format('D MMMM YYYY') || ''}
                                </span>
                            </p>
                        </div>
                    </div>

                    <hr className="border-t border-gray-300 dark:border-gray-700" />
                    {invDtlSkeleton && (
                        <div className="p-4">
                            <SkeletonList count={2} />
                        </div>
                    )}

                    {!invDtlSkeleton && (
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-600 dark:text-gray-200 font-semibold border-b border-gray-300 dark:border-gray-600">
                                <tr>
                                    <th>SL</th>
                                    <th className="py-2">Name</th>
                                    <th className="py-2 text-end">Qty</th>
                                    <th className="py-2 text-end">Price</th>
                                    <th className="py-2 text-end">Total </th>
                                </tr>
                            </thead>

                            <tbody id="invoiceList" className="text-gray-600 dark:text-gray-300">
                                {invInfo.invoice_products?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className="py-2">{item.product_name || ''}</td>
                                        <td className="py-2 text-end">{item.qty || 0}</td>
                                        <td className="py-2 text-end">{item.sale_price || 0}</td>
                                        <td className="py-2 text-end">
                                            {Number(item.sale_price) * Number(item.qty) || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <hr className="border-t border-gray-300 dark:border-gray-700" />

                    <div className="text-sm space-y-1 text-gray-600 dark:text-gray-200">
                        <p className="font-semibold">
                            TOTAL:
                            <span className="font-normal" id="total">
                                {invInfo.total || 0}
                            </span>
                        </p>
                        <p className="font-semibold">
                            PAYABLE:
                            <span className="font-normal" id="payable">
                                {invInfo.payable || 0}
                            </span>
                        </p>
                        <p className="font-semibold">
                            VAT (TK):
                            <span className="font-normal" id="vat">
                                {invInfo.vat_amount || 0}
                            </span>
                        </p>
                        <p className="font-semibold">
                            Discount:
                            <span className="font-normal" id="discount">
                                {invInfo.discount || 0}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex justify-center gap-2 px-6 py-4 border-t border-gray-300 dark:border-gray-700 print:hidden">
                    <button
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        onClick={closeBtnHandler}>
                        Close
                    </button>
                    <button
                        onClick={printBtnHandler}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded hover:from-blue-600 hover:to-purple-700 focus:outline-none">
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetail;
