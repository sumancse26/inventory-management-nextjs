'use client';

import { useAlert } from '@/context/AlertContext';
import Loader from '@components/loader';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const AddProduct = ({ isOpen, onClose, categoryList, handleSubmit, selectedProduct }) => {
    const [productInfo, setProductInfo] = useState({
        name: '',
        prod_code: '',
        price: '',
        mrp: '',
        image: '',
        stock: '',
        vat_pct: '',
        uom: '',
        uom_name: '',
        discount: ''
    });
    const [productImage, setProductImage] = useState('');
    const [preview, setPreview] = useState('');
    const [category, setCategory] = useState('');
    const [uomList, setUomList] = useState([
        {
            id: 1,
            name: 'Pcs'
        },
        {
            id: 2,
            name: 'Kg'
        },
        {
            id: 3,
            name: 'Ltr'
        },
        {
            id: 4,
            name: 'Box'
        }
    ]);
    const [loadingState, setLoadingState] = useState(false);
    const [totalPriceWithVat, setPriceWithVat] = useState(0);

    const { showAlert } = useAlert();

    useEffect(() => {
        if (selectedProduct && Object.keys(selectedProduct).length > 0) {
            setProductInfo({
                name: selectedProduct.name || '',
                prod_code: selectedProduct.prod_code || '',
                price: selectedProduct.unit_price || 0,
                mrp: selectedProduct.mrp || 0,
                image: selectedProduct.image || '',
                category_id: selectedProduct.category_id || '',
                stock: selectedProduct.stock || 0,
                vat_pct: selectedProduct.vat_pct || 0,
                uom: selectedProduct.uom || '',
                uom_name: selectedProduct.uom_name || '',
                discount: selectedProduct.discount || 0
            });
            setCategory(selectedProduct.category_id);
            if (selectedProduct.img_url) {
                setPreview(selectedProduct.img_url);
                setProductImage(selectedProduct.img_url);
            }
        } else {
            setProductInfo({
                name: '',
                price: '',
                prod_code: '',
                mrp: '',
                image: '',
                stock: '',
                vat_pct: '',
                uom: '',
                uom_name: '',
                discount: ''
            });
            setProductImage('');
            setPreview('');
            setCategory('');
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (productInfo.price && productInfo.vat_pct) {
            priceWithVat();
        }
        return () => {};
    }, [productInfo.price, productInfo.vat_pct]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProductImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name == 'vat_pct' && Number(value) > 100) {
            showAlert('VAT percentage cannot be greater than 100', 'error');
            return;
        }
        setProductInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleUom = (e) => {
        const { value } = e.target;
        const selectedUom = uomList.find((uom) => uom.id == value);
        setProductInfo((prev) => ({
            ...prev,
            uom_name: selectedUom.name,
            uom: selectedUom.id
        }));
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setLoadingState(true);

        const data = new FormData();
        data.append('id', selectedProduct.id);
        data.append('name', productInfo.name);
        data.append('prod_code', productInfo.prod_code);
        data.append('price', productInfo.price);
        data.append('mrp', productInfo.mrp);
        data.append('category_id', category);
        data.append('stock', productInfo.stock);
        data.append('vat_pct', productInfo.vat_pct);
        data.append('uom', productInfo.uom);
        data.append('uom_name', productInfo.uom_name);
        data.append('discount', productInfo.discount);

        if (productImage instanceof File) {
            data.append('image', productImage);
        } else {
            data.append('image', null);
        }

        if (productInfo.name == '' || productInfo.price == '' || category == '' || productInfo.stock == '') {
            showAlert('Fill all the fields', 'error');
            return;
        }

        const res = await handleSubmit(data);
        setLoadingState(false);

        if (res.success) {
            setProductInfo({
                name: '',
                price: '',
                prod_code: '',
                mrp: '',
                image: '',
                stock: '',
                vat_pct: '',
                uom_name: '',
                discount: ''
            });
            setProductImage('');
            setPreview('');
            setCategory('');
        }
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setCategory(value);
    };

    const priceWithVat = () => {
        const total =
            Number(productInfo.price) + (Number(productInfo.price || 0) * Number(productInfo.vat_pct || 0)) / 100;
        setPriceWithVat(total);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl p-4 md:p-8 transition-all duration-300 ease-in-out dark:bg-neutral-800">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 dark:text-white border-b border-gray-300">
                    {selectedProduct.id ? 'Update' : 'Create New'} Product
                </h2>

                <form className="space-y-6" onSubmit={submitForm}>
                    <div className="h-96 overflow-y-auto px-2">
                        {/* Grid Layout for Price, Stock, UOM, VAT, Discount */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Category */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    className="w-full px-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-neutral-700 dark:text-white"
                                    onChange={handleCategoryChange}
                                    required
                                    value={category}>
                                    <option value="" disabled>
                                        Select Category
                                    </option>
                                    {categoryList.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Product Code
                                </label>
                                <input
                                    type="text"
                                    name="prod_code"
                                    value={productInfo.prod_code || ''}
                                    onChange={(e) => handleInputChange(e)}
                                    placeholder="Enter product name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-neutral-700 dark:text-white"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={productInfo.name}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                    placeholder="Enter product name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-neutral-700 dark:text-white"
                                />
                            </div>
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Price <span className="text-red-500"> ({totalPriceWithVat || 0}) *</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={productInfo.price}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-neutral-700 dark:text-white"
                                />
                            </div>
                            {/* VAT */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    VAT (%) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="vat_pct"
                                    value={productInfo.vat_pct}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                    placeholder="e.g. 5"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-neutral-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    MRP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="mrp"
                                    value={productInfo.mrp || 0}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-neutral-700 dark:text-white"
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={productInfo.stock}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                    placeholder="1000"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-neutral-700 dark:text-white"
                                />
                            </div>

                            {/* UOM */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Stock UOM <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="uom_name"
                                    value={productInfo.uom}
                                    onChange={(e) => handleUom(e)}
                                    required
                                    placeholder="e.g. pcs, kg"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-neutral-700 dark:text-white">
                                    <option value="" disabled>
                                        Select Uom
                                    </option>
                                    {uomList.map((uom) => (
                                        <option key={uom.id} value={uom.id}>
                                            {uom.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Discount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Discount
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={productInfo.discount}
                                    onChange={(e) => handleInputChange(e)}
                                    placeholder="e.g. 10"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none dark:bg-neutral-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Product Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Product Image <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="product-image"
                                    className="cursor-pointer w-20 h-20 bg-gray-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300 relative group">
                                    {preview ? (
                                        <Image
                                            width={100}
                                            height={100}
                                            src={preview}
                                            alt="Product"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400 text-xs">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6 mb-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 16l4-4-4-4m0 8V8a2 2 0 012-2h14m-4 4l4 4-4 4"
                                                />
                                            </svg>
                                            <span>Upload</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </label>
                                <div className="flex-1 text-sm text-gray-700 dark:text-gray-300 break-all">
                                    {productImage?.name}
                                </div>
                                <input id="product-image" type="file" onChange={handleImageChange} className="hidden" />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-3 pt-4 border-t border-gray-300 dark:border-neutral-600">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-700">
                            Cancel
                        </button>
                        <button
                            disabled={loadingState}
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                            Save {loadingState && <Loader />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
