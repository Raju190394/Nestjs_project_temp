import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Middlewares
    app.use(cookieParser());

    // Validation
    app.useGlobalPipes(new ZodValidationPipe());

    // CORS
    app.enableCors({
        origin: configService.get('FRONTEND_URL'),
        credentials: true,
    });

    const port = configService.get('PORT') || 4000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
