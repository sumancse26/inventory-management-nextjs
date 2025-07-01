import Link from 'next/link';
import Navbar from './homeNavbar';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
                        Smarter Sales <br /> & Inventory Tracking
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Manage your stock, sales, and reporting with ease. Our intuitive dashboard helps businesses stay
                        in control.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all">
                        Get Started
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Home;
