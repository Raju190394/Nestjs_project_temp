import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ChangePasswordDto } from '../auth/dto/auth.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    // Self endpoints
    @Get('me')
    getMe(@GetCurrentUser('id') userId: string) {
        return this.usersService.findById(userId);
    }

    @Patch('me')
    updateMe(@GetCurrentUser('id') userId: string, @Body() dto: any) {
        return this.usersService.update(userId, dto);
    }

    @Patch('change-password')
    changePassword(@GetCurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
        return this.usersService.changePassword(userId, dto);
    }

    // Admin endpoints
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() dto: any) {
        return this.usersService.create(dto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: any) {
        return this.usersService.update(id, dto);
    }

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
