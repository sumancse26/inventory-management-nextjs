'use client';
import { doLogoutAction, getProfileAction } from '@/app/actions/authAction';
import { useAlert } from '@/context/AlertContext';
import { useApiLoader } from '@/lib/useApiLoader';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const Header = ({ logoHandler }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profile, setProfile] = useState({});
    const dropdownRef = useRef(null);
    const router = useRouter();
    const { showAlert } = useAlert();
    const { start, stop } = useApiLoader();

    // Close dropdown when clicking outside

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            start();
            const result = await getProfileAction();

            stop();
            if (result.success) {
                setProfile(result.user);
            }
        } catch (error) {
            stop();
            showAlert('Failed to fetch profile', 'error');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logoutHandler = async () => {
        const result = await doLogoutAction();
        if (result.success) {
            showAlert(result.message, 'success');
            await Cookies.remove('token');
            router.push('/login');
        } else {
            showAlert(result.message, 'error');
        }
    };

    const logoBtnHandler = () => {
        logoHandler();
    };
    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center  gap-5">
                        <Link href="/dashboard" className="flex items-center">
                            <Image
                                src="/uploads/logo.png"
                                alt="SalesInventory Logo"
                                width={50}
                                height={36}
                                priority
                                style={{ width: '80px', height: 'auto' }}
                            />
                        </Link>
                        <button className="lg:hidden xl:hidden 2xl:hidden flex items-center justify-center mt-2 cursor-pointer">
                            <span className="material-icons" onClick={() => logoBtnHandler(true)}>
                                menu
                            </span>
                        </button>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        {/* User Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="flex items-center space-x-2 focus:outline-none">
                                <div className="relative">
                                    <img className="h-8 w-8 rounded-full" src={profile.image} alt="User profile" />
                                    <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
                                </div>
                                <span className="hidden md:inline-block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {profile.first_name || ''} {profile.last_name || ''}
                                </span>
                                <svg
                                    className="hidden md:block h-4 w-4 text-gray-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <li>
                                        <button
                                            onClick={() => router.push('/auth/profile')}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            Profile
                                        </button>
                                    </li>
                                    <li>
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            Settings
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={logoutHandler}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            Sign out
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
