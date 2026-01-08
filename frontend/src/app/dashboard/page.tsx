'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { BarChart3, TrendingUp, PieChart, AreaChart as AreaChartIcon } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Chart Components (Visual only for UI match)
const BarChartMock = () => (
    <div className="flex items-end justify-between h-40 gap-2 px-2">
        {[40, 70, 45, 90, 60, 75, 50, 80, 95].map((h, i) => (
            <div key={i} className="w-full bg-blue-400/20 rounded-t-sm relative group">
                <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-primary hover:bg-blue-600 transition-all rounded-t-sm"></div>
            </div>
        ))}
    </div>
);

const AreaChartMock = () => (
    <div className="relative h-40 w-full overflow-hidden">
        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 30 Q 20 10, 40 25 T 80 15 T 100 20 V 40 H 0 Z" fill="rgba(0, 156, 255, 0.2)" stroke="none" />
            <path d="M0 30 Q 20 10, 40 25 T 80 15 T 100 20" fill="none" stroke="#009CFF" strokeWidth="0.5" />
        </svg>
    </div>
);

const WidgetCard = ({ icon: Icon, title, value, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
    >
        <div className="space-y-1">
            <p className="text-sm font-bold text-slate-500 uppercase">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <Icon className="w-10 h-10 text-primary" />
    </motion.div>
);

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Top Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <WidgetCard icon={BarChart3} title="Today Sale" value="$1234" delay={0.1} />
                    <WidgetCard icon={TrendingUp} title="Total Sale" value="$1234" delay={0.2} />
                    <WidgetCard icon={AreaChartIcon} title="Today Revenue" value="$1234" delay={0.3} />
                    <WidgetCard icon={PieChart} title="Total Revenue" value="$1234" delay={0.4} />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h6 className="text-sm font-bold text-slate-700 uppercase">Worldwide Sales</h6>
                            <button className="text-primary text-xs font-bold hover:underline">Show All</button>
                        </div>
                        <BarChartMock />
                        <div className="flex justify-center mt-4 gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-primary"></div> USA</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-300"></div> UK</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-200"></div> AU</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h6 className="text-sm font-bold text-slate-700 uppercase">Sales & Revenue</h6>
                            <button className="text-primary text-xs font-bold hover:underline">Show All</button>
                        </div>
                        <AreaChartMock />
                        <div className="flex justify-center mt-4 gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-primary"></div> Sales</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-200"></div> Revenue</span>
                        </div>
                    </div>
                </div>

                {/* Recent Sales Table */}
                <div className="bg-white p-6 rounded shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h6 className="text-sm font-bold text-slate-700 uppercase">Recent Sales</h6>
                        <button className="text-primary text-xs font-bold hover:underline">Show All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-800 border-b">
                                    <th className="p-4 text-sm font-bold">
                                        <input type="checkbox" className="accent-primary" />
                                    </th>
                                    <th className="p-4 text-sm font-bold">Date</th>
                                    <th className="p-4 text-sm font-bold">Invoice</th>
                                    <th className="p-4 text-sm font-bold">Customer</th>
                                    <th className="p-4 text-sm font-bold">Amount</th>
                                    <th className="p-4 text-sm font-bold">Status</th>
                                    <th className="p-4 text-sm font-bold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-500 text-sm">
                                {[
                                    { date: '01 Jan 2045', inv: 'INV-0123', name: 'Jhon Doe', amt: '$123', status: 'Paid' },
                                    { date: '01 Jan 2045', inv: 'INV-0123', name: 'Jhon Doe', amt: '$123', status: 'Paid' },
                                    { date: '01 Jan 2045', inv: 'INV-0123', name: 'Jhon Doe', amt: '$123', status: 'Paid' },
                                    { date: '01 Jan 2045', inv: 'INV-0123', name: 'Jhon Doe', amt: '$123', status: 'Paid' },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="p-4"><input type="checkbox" className="accent-primary" /></td>
                                        <td className="p-4">{row.date}</td>
                                        <td className="p-4">{row.inv}</td>
                                        <td className="p-4">{row.name}</td>
                                        <td className="p-4">{row.amt}</td>
                                        <td className="p-4">{row.status}</td>
                                        <td className="p-4">
                                            <button className="bg-primary text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-600 transition-colors">
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
