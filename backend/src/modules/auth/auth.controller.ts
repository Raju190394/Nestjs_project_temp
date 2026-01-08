import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Public } from '../../common/decorators/public.decorator';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.register(dto);
        this.authService.storeTokenInCookie(res, tokens.access_token, 'access');
        this.authService.storeTokenInCookie(res, tokens.refresh_token, 'refresh');
        return { message: 'User registered successfully' };
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(dto);
        this.authService.storeTokenInCookie(res, tokens.access_token, 'access');
        this.authService.storeTokenInCookie(res, tokens.refresh_token, 'refresh');
        return { message: 'Logged in successfully' };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(
        @GetCurrentUser('sub') userId: string,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies['refresh_token'];
        await this.authService.logout(userId, refreshToken);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }

    @Public()
    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
        @GetCurrentUser('sub') userId: string,
        @GetCurrentUser('refreshToken') rt: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.refreshTokens(userId, rt);
        this.authService.storeTokenInCookie(res, tokens.access_token, 'access');
        this.authService.storeTokenInCookie(res, tokens.refresh_token, 'refresh');
        return { message: 'Tokens refreshed' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@GetCurrentUser() user: any) {
        return user;
    }
}
