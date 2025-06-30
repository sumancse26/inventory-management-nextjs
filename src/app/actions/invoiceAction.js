'use server';
import { deleteInvoice, getInvoice, getInvoiceInfo, saveInvoice, updateCollection } from '@/services/invoice.js';

export const confirmSaleAction = async (data) => {
    const res = await saveInvoice(data);

    return res;
};

export const invoiceListAction = async () => {
    const res = await getInvoice();

    return res;
};

export const invoiceInfoAction = async (invId) => {
    const res = await getInvoiceInfo(invId);

    return res;
};

export const deleteInvoiceAction = async (data) => {
    const res = await deleteInvoice(data);

    return res;
};

export const collectionAction = async (data) => {
    const res = await updateCollection(data);

    return res;
};
