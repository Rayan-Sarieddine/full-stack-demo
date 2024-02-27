import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

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
      // Redirect or respond as needed
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
}
