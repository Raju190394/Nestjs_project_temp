'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    BarChart3,
    Users,
    Settings,
    Menu,
    Search,
    Bell,
    Mail,
    ChevronDown,
    LayoutGrid,
    FileText,
    Table as TableIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ href, icon: Icon, label, active }: any) => (
    <Link href={href}>
        <div className={`
      flex items-center gap-4 px-6 py-3 transition-all duration-200 relative
      ${active ? 'text-primary' : 'text-slate-500 hover:text-primary hover:bg-slate-50'}
    `}>
            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"></div>}
            <div className={`p-1 rounded ${active ? '' : ''}`}>
                <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
            </div>
            <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
        </div>
    </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-[#F3F6F9]">
            {/* Sidebar - Fixed White */}
            <aside className="w-64 bg-white hidden lg:flex flex-col fixed h-full z-50 shadow-[0_0_15px_rgba(0,0,0,0.05)]">
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-dashed border-slate-100">
                    <h1 className="text-2xl font-black text-primary tracking-tight flex items-center gap-2">
                        <span className="text-primary">#</span> Test
                    </h1>
                </div>

                {/* User Profile in Sidebar (Dashmin Style) */}
                <div className="px-6 py-8 flex items-center gap-4 border-b border-dashed border-slate-100 mb-4">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=009CFF&color=fff`} alt="User" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h6 className="text-sm font-bold text-slate-800">{user.firstName} {user.lastName}</h6>
                        <p className="text-xs text-slate-500">{user.role === 'ADMIN' ? 'Admin' : 'User'}</p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-2">
                    <SidebarItem href="/dashboard" icon={BarChart3} label="Dashboard" active={pathname === '/dashboard'} />

                    {user.role === 'ADMIN' && (
                        <>
                            <SidebarItem href="/users" icon={Users} label="Users" active={pathname === '/users'} />
                            <SidebarItem href="/settings" icon={Settings} label="Settings" active={pathname === '/settings'} />
                        </>
                    )}

                    <SidebarItem href="#" icon={LayoutGrid} label="Widgets" active={false} />
                    <SidebarItem href="#" icon={FileText} label="Forms" active={false} />
                    <SidebarItem href="#" icon={TableIcon} label="Tables" active={false} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Header - White Navbar */}
                <header className="h-16 bg-white sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm lg:px-10">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 -ml-2 hover:bg-slate-50 text-slate-500 rounded-full">
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center bg-transparent">
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent text-sm outline-none w-64 text-slate-600 placeholder:text-slate-400"
                            />
                            <Search className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <button className="relative flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                                <Mail className="w-5 h-5" />
                                <span className="hidden sm:inline text-sm font-medium">Message</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                            <button className="relative flex items-center gap-2 text-slate-600 hover:text-primary transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="hidden sm:inline text-sm font-medium">Notification</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 cursor-pointer pl-6 border-l" onClick={logout}>
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=009CFF&color=fff`} alt="User" />
                            </div>
                            <span className="hidden sm:inline text-sm font-medium text-slate-800">{user.firstName} {user.lastName}</span>
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-6 lg:p-10 flex-1 w-full mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
