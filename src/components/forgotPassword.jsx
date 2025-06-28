'use client';

import { mailSendingAction, otpVerificationAction } from '@/app/actions/authAction';
import { useAlert } from '@/context/AlertContext';
import { useApiLoader } from '@/lib/useApiLoader';
import Loader from '@components/loader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loadingState, setLoadingState] = useState(false);

    const router = useRouter();
    const { showAlert } = useAlert();
    const { start, stop } = useApiLoader();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoadingState(true);
        const randomOtp = Math.floor(10000 + Math.random() * 90000);
        start();
        const res = await mailSendingAction(null, email, randomOtp);
        stop();
        setLoadingState(false);
        if (res.success) {
            showAlert(res.message, 'success');
            await otpVerificationAction(null, randomOtp, email);
            router.push(`/submit-otp?email=${email}`);
        } else {
            stop();
            showAlert(res.message, 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md animate-fade-in">
                <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-4">Forgot Password?</h2>
                <p className="text-center text-gray-500 text-sm mb-8">
                    Enter your email and we will send you a link to reset your password.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <button
                        disabled={loadingState}
                        type="submit"
                        className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-white font-semibold rounded-xl shadow-md hover:shadow-lg focus:outline-none">
                        Send Reset Link {loadingState && <Loader />}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link
                        href="/login"
                        className="text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200 hover:underline">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
