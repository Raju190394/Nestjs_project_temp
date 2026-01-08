import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) { }

    async register(dto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                firstName: dto.firstName,
                lastName: dto.lastName,
            },
        });

        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }

    async logout(userId: string, refreshToken: string) {
        const tokens = await this.prisma.refreshToken.findMany({
            where: { userId },
        });

        for (const t of tokens) {
            const isMatch = await bcrypt.compare(refreshToken, t.token);
            if (isMatch) {
                await this.prisma.refreshToken.delete({ where: { token: t.token } });
                break;
            }
        }
    }

    async refreshTokens(userId: string, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new ForbiddenException('Access Denied');

        const storedTokens = await this.prisma.refreshToken.findMany({
            where: {
                userId,
                expiresAt: { gt: new Date() }
            },
        });

        let validTokenId: string | null = null;
        for (const t of storedTokens) {
            const isMatch = await bcrypt.compare(rt, t.token);
            if (isMatch) {
                validTokenId = t.id;
                break;
            }
        }

        if (!validTokenId) throw new ForbiddenException('Access Denied');

        // Remove the used refresh token
        await this.prisma.refreshToken.delete({ where: { id: validTokenId } });

        const tokens = await this.getTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }

    async updateRefreshToken(userId: string, rt: string) {
        const hash = await bcrypt.hash(rt, 10);

        // Cleanup expired tokens for this user
        await this.prisma.refreshToken.deleteMany({
            where: {
                userId,
                expiresAt: { lt: new Date() },
            },
        });

        await this.prisma.refreshToken.create({
            data: {
                token: hash,
                userId: userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
    }

    async getTokens(userId: string, email: string, role: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email, role },
                {
                    secret: this.config.get('JWT_ACCESS_SECRET'),
                    expiresIn: this.config.get('JWT_ACCESS_EXPIRATION') || '15m',
                },
            ),
            this.jwtService.signAsync(
                { sub: userId, email, role },
                {
                    secret: this.config.get('JWT_REFRESH_SECRET'),
                    expiresIn: this.config.get('JWT_REFRESH_EXPIRATION') || '7d',
                },
            ),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    storeTokenInCookie(res: Response, token: string, type: 'access' | 'refresh') {
        const isProd = this.config.get('NODE_ENV') === 'production';
        res.cookie(type === 'access' ? 'access_token' : 'refresh_token', token, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            path: '/',
            maxAge: type === 'access' ? 15 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
        });
    }
}
