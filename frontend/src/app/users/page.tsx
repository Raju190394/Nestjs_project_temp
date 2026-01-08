'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserSchema, UpdateUserSchema } from '@/lib/schemas';
import { Loader2, Plus, X } from 'lucide-react';
import { z } from 'zod';

type CreateUserForm = z.infer<typeof CreateUserSchema>;
type UpdateUserForm = z.infer<typeof UpdateUserSchema>;

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axios.get('/users');
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateUserForm) => axios.post('/users', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);
            reset();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserForm }) => axios.patch(`/users/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);
            setEditingUser(null);
            reset();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => axios.delete(`/users/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateUserForm>({
        resolver: zodResolver(editingUser ? UpdateUserSchema : CreateUserSchema),
    });

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (user: any) => {
        setEditingUser(user);
        setValue('firstName', user.firstName);
        setValue('lastName', user.lastName);
        setValue('email', user.email);
        setValue('role', user.role);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Delete this user?')) {
            deleteMutation.mutate(id);
        }
    };

    const onSubmit = (data: any) => {
        if (editingUser) {
            updateMutation.mutate({ id: editingUser.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <DashboardLayout>
            <div className="bg-white p-6 rounded shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h6 className="text-sm font-bold text-slate-700 uppercase">User Management</h6>
                    <button
                        onClick={openCreateModal}
                        className="bg-primary text-white text-xs font-bold px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> Add New
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="text-slate-800 border-b bg-slate-50">
                                <th className="p-4 font-bold"><input type="checkbox" className="accent-primary" /></th>
                                <th className="p-4 font-bold">Identity</th>
                                <th className="p-4 font-bold">Email</th>
                                <th className="p-4 font-bold">Role</th>
                                <th className="p-4 font-bold">Joined Date</th>
                                <th className="p-4 font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-500">
                            {isLoading ? (
                                <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
                            ) : (
                                users?.map((u: any) => (
                                    <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="p-4"><input type="checkbox" className="accent-primary" /></td>
                                        <td className="p-4 font-medium text-slate-700">{u.firstName} {u.lastName}</td>
                                        <td className="p-4">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 flex gap-3">
                                            <button
                                                onClick={() => openEditModal(u)}
                                                className="text-blue-500 hover:text-blue-700 font-bold text-xs"
                                            >
                                                Edit
                                            </button>
                                            {u.id !== currentUser?.id && (
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    className="text-red-500 hover:text-red-700 font-bold text-xs"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modern Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
                            <h3 className="font-bold text-slate-800">{editingUser ? 'Edit User' : 'Create New User'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">First Name</label>
                                    <input {...register('firstName')} className="w-full h-9 px-3 border rounded text-sm focus:outline-none focus:border-primary" />
                                    {errors.firstName && <p className="text-[10px] text-red-500 mt-1">{errors.firstName.message}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">Last Name</label>
                                    <input {...register('lastName')} className="w-full h-9 px-3 border rounded text-sm focus:outline-none focus:border-primary" />
                                    {errors.lastName && <p className="text-[10px] text-red-500 mt-1">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                                <input {...register('email')} className="w-full h-9 px-3 border rounded text-sm focus:outline-none focus:border-primary" />
                                {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>}
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                                    <input type="password" {...register('password')} className="w-full h-9 px-3 border rounded text-sm focus:outline-none focus:border-primary" />
                                    {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password.message}</p>}
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">Role</label>
                                <select {...register('role')} className="w-full h-9 px-3 border rounded text-sm focus:outline-none focus:border-primary bg-white">
                                    <option value="USER">User (Standard Access)</option>
                                    <option value="ADMIN">Admin (Full Access)</option>
                                </select>
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border rounded text-xs font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="px-6 py-2 bg-primary text-white rounded text-xs font-bold hover:bg-blue-600 flex items-center gap-2"
                                >
                                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-3 h-3 animate-spin" />}
                                    {editingUser ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
