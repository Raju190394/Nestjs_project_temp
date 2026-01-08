import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const ChangePasswordSchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(8),
});

export class RegisterDto extends createZodDto(RegisterSchema) { }
export class LoginDto extends createZodDto(LoginSchema) { }
export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) { }
