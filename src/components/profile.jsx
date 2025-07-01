'use client';

import { getProfileAction } from '@/app/actions/authAction';
import { useAlert } from '@/context/AlertContext';
import { useApiLoader } from '@/lib/useApiLoader';
import { updateProfile } from '@/services/inventory';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { NextResponse } from 'next/server';
import { useEffect, useState } from 'react';

const UpdateProfile = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        image: ''
    });

    const [profileImage, setProfileImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const { showAlert } = useAlert();
    const router = useRouter();
    const { start, stop } = useApiLoader();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            start();
            const profile = await getProfileAction();
            if (profile.success) {
                setFormData({
                    first_name: profile.user?.first_name || '',
                    last_name: profile.user?.last_name || '',
                    email: profile.user?.email || '',
                    mobile: profile.user?.mobile || '',
                    image: profile.user?.image || ''
                });

                if (profile.user?.image) {
                    setPreview(profile.user?.image || null);
                }
            }
            stop();
        } catch (error) {
            showAlert('Failed to load profile', 'error');
            stop();
            console.error('Failed to load profile:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            start();
            const data = new FormData();
            data.append('first_name', formData.first_name);

            data.append('last_name', formData.last_name);
            data.append('email', formData.email);
            data.append('mobile', formData.mobile);

            if (profileImage instanceof File) {
                data.append('image', profileImage);
            }

            const res = await updateProfile(data);
            stop();
            if (res.success) {
                showAlert('Profile updated successfully', 'success');
                router.push('/dashboard');
            }
        } catch (err) {
            stop();
            showAlert('Failed to update profile', 'error');
            return NextResponse.json({
                success: false,
                message: 'Failed to update profile',
                error: err.message
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Update Profile</h2>

            <div className="flex justify-center mb-6">
                <div className="relative w-28 h-28">
                    {preview && (
                        <Image
                            src={preview}
                            width={200}
                            height={200}
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover border-2 border-indigo-500"
                        />
                    )}

                    <label className="absolute bottom-0 right-0 bg-indigo-600 p-1 rounded-full cursor-pointer hover:bg-indigo-700">
                        <input type="file" className="hidden" onChange={handleImageChange} />
                        {/* accept="image/*" */}
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h6a1 1 0 000-2H4V5h12v4a1 1 0 102 0V5a2 2 0 00-2-2H4zm4 9a3 3 0 100-6 3 3 0 000 6zm9.707 1.707a1 1 0 00-1.414 0l-2.121 2.121-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" />
                        </svg>
                    </label>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 outline-none border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="John"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 outline-none border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="Doe"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 outline-none border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="john@example.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 outline-none border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="+8801XXXXXXXXX"
                    />
                </div>

                <div className="border-t border-gray-200 pt-3 flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
                    <button
                        onClick={() => router.push('/dashboard')}
                        type="button"
                        className="w-full md:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition">
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProfile;
