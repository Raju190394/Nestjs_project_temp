'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from '@/lib/axios';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
    firstName: z.string().min(2, 'Too short'),
    lastName: z.string().min(2, 'Too short'),
    email: z.string().email('Invalid email'),
});

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
        }
    });

    const onUpdateProfile = async (data: any) => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.patch('/users/me', data);
            setUser(res.data);
            setSuccess('Profile updated successfully.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Form */}
                <div className="bg-white p-6 rounded shadow-sm">
                    <h6 className="text-sm font-bold text-slate-700 uppercase mb-6">Edit Profile</h6>

                    {success && <div className="mb-4 p-3 bg-green-50 text-green-600 text-xs font-bold rounded">{success}</div>}
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded">{error}</div>}

                    <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-1">First Name</label>
                            <input {...register('firstName')} className="w-full h-10 px-3 border border-slate-200 rounded text-sm focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-1">Last Name</label>
                            <input {...register('lastName')} className="w-full h-10 px-3 border border-slate-200 rounded text-sm focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-1">Email</label>
                            <input {...register('email')} disabled className="w-full h-10 px-3 border border-slate-200 rounded text-sm bg-slate-50 cursor-not-allowed" />
                        </div>

                        <button disabled={loading} className="px-6 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-blue-600 transition-colors">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Settings Card */}
                <div className="bg-white p-6 rounded shadow-sm h-fit">
                    <h6 className="text-sm font-bold text-slate-700 uppercase mb-6">Account Settings</h6>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded">
                            <div>
                                <p className="text-sm font-bold text-slate-700">Two-Factor Authentication</p>
                                <p className="text-xs text-slate-500">Secure your account</p>
                            </div>
                            <button className="text-primary text-xs font-bold hover:underline">Enable</button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded border-red-50 bg-red-50/10">
                            <div>
                                <p className="text-sm font-bold text-red-600">Delete Account</p>
                                <p className="text-xs text-slate-500">Permanent action</p>
                            </div>
                            <button className="text-red-500 text-xs font-bold hover:underline">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
