'use client'; // Only needed if you're using the App Router in Next.js 13+

import Image from 'next/image';
import Link from 'next/link';

const HomeNavbar = () => {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <Image src="/uploads/logo.png" alt="SalesInventory Logo" width={65} height={56} />
                </Link>

                <div className="space-x-6 hidden md:flex">
                    <Link href="/" className="text-gray-700 hover:text-purple-600 transition">
                        Home
                    </Link>
                    <Link href="/about" className="text-gray-700 hover:text-purple-600 transition">
                        About
                    </Link>
                    <Link href="/login" className="text-gray-700 hover:text-purple-600 transition">
                        Login
                    </Link>
                    <Link href="/register" className="text-gray-700 hover:text-purple-600 transition">
                        SignUp
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default HomeNavbar;
