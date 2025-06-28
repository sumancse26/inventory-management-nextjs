'use server';
import { addCategory, deleteCategory, getCategoryList, updateCategory } from '@/services/category.js';

export const categoryListAction = async () => {
    const res = await getCategoryList();

    return res;
};

export const addCategoryAction = async (data) => {
    const res = await addCategory(data);

    return res;
};

export const updateCategoryAction = async (data) => {
    const res = await updateCategory(data);

    return res;
};

export const deleteCategoryAction = async (id) => {
    const res = await deleteCategory({ id: id });

    console.log('hjdfjhd', res);
    return res;
};
