import { z } from 'zod';

export const CreateUserSchema = z.object({
    firstName: z.string().min(2, 'First name is too short'),
    lastName: z.string().min(2, 'Last name is too short'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['USER', 'ADMIN']),
});

export const UpdateUserSchema = z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
});
