'use client';

import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="h-20 border-b border-dashed border-slate-100 flex items-center justify-between px-6 lg:px-20">
                <div className="text-2xl font-black text-primary flex items-center gap-2">
                    <span className="text-primary">#</span> Test
                </div>
                <div className="flex gap-6">
                    <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Sign In</Link>
                    <Link href="/register" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Sign Up</Link>
                </div>
            </nav>

            {/* Hero */}
            <div className="py-20 lg:py-32 px-6 lg:px-20 text-center max-w-4xl mx-auto space-y-8">
                <h1 className="text-5xl lg:text-6xl font-black text-slate-800 leading-tight">
                    The World's Best <br /><span className="text-primary">Admin Template</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                    Responsive, lightweight, and fully integrated with NestJS and Prisma. Start building your SaaS application today with Test.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/login" className="px-8 py-3 bg-primary text-white font-bold rounded shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all transform hover:-translate-y-1">
                        Get Started
                    </Link>
                    <button className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded hover:bg-slate-50 transition-colors">
                        Live Demo
                    </button>
                </div>
            </div>

            {/* Mock Visual */}
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="bg-[#F3F6F9] rounded-t-xl p-4 lg:p-10 border border-b-0 shadow-2xl">
                    <div className="grid grid-cols-4 gap-6 mb-10">
                        <div className="h-32 bg-white rounded shadow-sm"></div>
                        <div className="h-32 bg-white rounded shadow-sm"></div>
                        <div className="h-32 bg-white rounded shadow-sm"></div>
                        <div className="h-32 bg-white rounded shadow-sm"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="h-64 bg-white rounded shadow-sm"></div>
                        <div className="h-64 bg-white rounded shadow-sm"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
