'use server';
import { getInvoice, getInvoiceInfo, saveInvoice } from '@/services/invoice.js';

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
