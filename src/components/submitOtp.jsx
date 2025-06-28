'use client';

import { submitOtpAction } from '@/app/actions/authAction';
import { useAlert } from '@/context/AlertContext';
import { useApiLoader } from '@/lib/useApiLoader';
import Loader from '@components/loader';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const ForgotPassword = () => {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loadingState, setLoadingState] = useState(false);

    const router = useRouter();
    const { showAlert } = useAlert();
    const searchParams = useSearchParams();
    const { start, stop } = useApiLoader();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoadingState(true);
        const email = searchParams.get('email');
        const formData = {
            otp: otp,
            password: newPassword,
            email
        };
        start();
        const res = await submitOtpAction(null, formData);
        stop();
        setLoadingState(false);
        if (res.success) {
            showAlert(res.message, 'success');
            router.push('/dashboard');
        } else {
            setOtp('');
            showAlert(res.message, 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md animate-fade-in">
                <p className="text-center text-gray-500 text-sm mb-8">Enter OTP sent to your email.</p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                        <input
                            type="text"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder="10548"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter New Password</label>
                        <input
                            type="text"
                            name="new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="New Password"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <button
                        disabled={loadingState}
                        type="submit"
                        className="w-full py-3 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-white font-semibold rounded-xl shadow-md hover:shadow-lg focus:outline-none">
                        Submit {loadingState && <Loader />}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link
                        href="/reset-password"
                        className="text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200 hover:underline">
                        ← Back to Forgot Password
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
