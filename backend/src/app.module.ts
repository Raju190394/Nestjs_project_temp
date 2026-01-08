import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 10,
        }]),
        PrismaModule,
        AuthModule,
        UsersModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule { }
