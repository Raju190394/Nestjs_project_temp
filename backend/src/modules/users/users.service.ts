import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async create(dto: any) {
        const hashedPassword = await bcrypt.hash(dto.password || 'Password123!', 10);
        return this.prisma.user.create({
            data: {
                ...dto,
                password: hashedPassword,
            },
        });
    }

    async update(id: string, dto: any) {
        return this.prisma.user.update({
            where: { id },
            data: dto,
        });
    }

    async delete(id: string) {
        return this.prisma.user.delete({
            where: { id },
        });
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const matches = await bcrypt.compare(dto.oldPassword, user.password);
        if (!matches) throw new BadRequestException('Incorrect old password');

        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        return this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }
}
