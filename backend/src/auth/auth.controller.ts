// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  Query,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    const userType = body.userType || 'USER';
    return this.authService.register(
      body.email,
      body.password,
      body.fullName,
      userType,
    );
  }
  @Get('verify')
  async verifyEmail(@Query('token') token: string, @Res() res: any) {
    try {
      await this.authService.verifyEmail(token);

      res.redirect('http://localhost:3000/email-verified');
    } catch (error) {
      res.status(400).send('Email verification failed');
    }
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.authService.sendPasswordResetEmail(email);
    return {
      message:
        'If a user with that email exists, we have sent an email with further instructions',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.authService.resetPassword(token, newPassword);
    return { message: 'Your password has been successfully reset.' };
  }
  @Post('google-login')
  async googleAuth(@Body('token') token: string) {
    return this.authService.googleLogin(token);
  }
}
