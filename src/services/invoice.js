import { fetchApi } from '@/lib/api';

export const saveInvoice = async (data) => {
    const res = await fetchApi('/api/dashboard/invoices', {
        method: 'POST',
        body: JSON.stringify(data)
    });

    return res;
};

export const getInvoice = async () => {
    const res = await fetchApi('/api/dashboard/invoices', {
        method: 'GET'
    });

    return res;
};

export const getInvoiceInfo = async (id) => {
    const res = await fetchApi(`/api/dashboard/invoices/${id}`, {
        method: 'GET'
    });

    return res;
};

export const deleteInvoice = async (data) => {
    const res = await fetchApi(`/api/dashboard/invoices`, {
        method: 'DELETE',
        body: JSON.stringify(data)
    });

    return res;
};
