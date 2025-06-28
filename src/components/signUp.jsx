'use client';

import { registerAction } from '@/app/actions/authAction';
import { useAlert } from '@/context/AlertContext';
import { useApiLoader } from '@/lib/useApiLoader';
import Loader from '@components/loader';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        mobile: '',
        password: '',
        image: ''
    });
    const [loadingState, setLoadingState] = useState(false);

    const router = useRouter();
    const { showAlert } = useAlert();
    const { start, stop } = useApiLoader();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        setLoadingState(true);
        start();
        const result = await registerAction(null, formData);
        setLoadingState(false);
        if (result && result.success) {
            router.push('/auth/login');
            showAlert(result.message, 'success');
            setFormData({
                email: '',
                first_name: '',
                last_name: '',
                mobile: '',
                password: '',
                image: ''
            });
            stop();
        } else {
            stop();
            showAlert(result.message, 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
            <form
                className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-4xl animate-fade-in"
                onSubmit={handleFormSubmit}>
                <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-4">Create Your Account</h2>
                <p className="text-sm text-gray-500 text-center mb-8">Fill in the details below to get started.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="admin@gmail.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            required
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            required
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            required
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Mobile"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex justify-center w-full">
                    <button
                        disabled={loadingState}
                        type="submit"
                        className="w-full flex items-center justify-center md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 text-white font-semibold rounded-xl shadow-md hover:shadow-lg focus:outline-none">
                        Complete Registration {loadingState && <Loader />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
