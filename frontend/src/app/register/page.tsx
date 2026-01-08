'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name is too short'),
    lastName: z.string().min(2, 'Last name is too short'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { register: signup } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            setLoading(true);
            setError(null);
            await signup(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F6F9] flex items-center justify-center p-6">
            <div className="w-full max-w-[500px] bg-white p-8 rounded shadow-sm">
                {/* Logo/Header */}
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-black text-primary tracking-tight flex items-center gap-2 mb-2">
                        <span className="text-primary">#</span> Test
                    </h1>
                    <p className="text-sm font-medium text-slate-500">Sign Up for Admin</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded bg-red-50 border border-red-100 text-red-500 text-xs font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">First Name</label>
                            <input
                                type="text"
                                {...register('firstName')}
                                className="w-full h-10 px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-primary transition-colors bg-white"
                                placeholder="John"
                            />
                            {errors.firstName && <p className="text-xs text-red-500 font-bold">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Last Name</label>
                            <input
                                type="text"
                                {...register('lastName')}
                                className="w-full h-10 px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-primary transition-colors bg-white"
                                placeholder="Doe"
                            />
                            {errors.lastName && <p className="text-xs text-red-500 font-bold">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-primary transition-colors bg-white"
                            placeholder="name@email.com"
                        />
                        {errors.email && <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="w-full h-10 px-3 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-primary transition-colors bg-white"
                            placeholder="At least 8 chars"
                        />
                        {errors.password && <p className="text-xs text-red-500 font-bold">{errors.password.message}</p>}
                    </div>

                    <button
                        disabled={loading}
                        className="w-full h-10 bg-primary hover:bg-blue-600 text-white font-bold text-sm rounded transition-colors flex items-center justify-center disabled:opacity-50 mt-4"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SIGN UP'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
