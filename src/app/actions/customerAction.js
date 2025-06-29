'use server';
import { addCustomer, deleteCustomer, getCustomerList, updateCustomer } from '@/services/customer.js';

export const customerListAction = async () => {
    const res = await getCustomerList();

    return res;
};

export const saveCustomerAction = async (data) => {
    const res = await addCustomer(data);

    return res;
};

export const updateCustomerAction = async (data) => {
    const res = await updateCustomer(data);

    return res;
};

export const deleteCustomerAction = async (data) => {
    const res = await deleteCustomer(data);

    return res;
};
