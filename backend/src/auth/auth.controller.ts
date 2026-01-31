import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: any) {
        const user = await this.authService.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return this.authService.login(user);
    }

    @Public()
    @Post('register')
    async register(@Body() registerDto: any) {
        return this.usersService.create(registerDto.username, registerDto.password);
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
