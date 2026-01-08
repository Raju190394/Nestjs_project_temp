import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.refresh_token;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) throw new UnauthorizedException();
        return { ...payload, refreshToken };
    }
}
