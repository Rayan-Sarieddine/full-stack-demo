// src/auth/auth.service.ts
import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

type UserType = 'USER' | 'ADMIN';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    fullName: string,
    userType: UserType,
  ): Promise<any> {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new HttpException(
        'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Full name validation
    const nameParts = fullName.split(' ');
    if (
      nameParts.length < 2 ||
      !nameParts.every((part) => part.length >= 2 && /^[A-Za-z]+$/.test(part))
    ) {
      throw new HttpException(
        'Full name must include at least a first name and a last name, both at least 2 characters long without numbers',
        HttpStatus.BAD_REQUEST,
      );
    }
    const capitalizedNames = nameParts.map(
      (part: string): string => part.charAt(0).toUpperCase() + part.slice(1),
    );
    const capitalizedFullname: string = capitalizedNames.join(' ');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const emailVerificationToken = uuidv4();
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName: capitalizedFullname,
          emailVerificationToken,
          userType,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          userType: true,
        },
      });
      this.sendVerificationEmail(user.email, emailVerificationToken).catch(
        console.error,
      );
      return { message: 'success' };
    } catch (error) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
  }
  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerificationToken: '' },
    });

    return true;
  }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      if (!user.emailVerified) {
        throw new HttpException('Email not verified', HttpStatus.UNAUTHORIZED);
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
      },
    };
  }
  private async sendVerificationEmail(email: string, token: string) {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: '"rayan@maxiphy.com>',
      to: email,
      subject: 'Verify Your Email',
      text: 'Please click below to verify your email',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { background-color: #ffffff; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
          h4 { color: #333333; }
          p { color: #666666; }
          a.button { background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px; }
      </style>
      </head>
      <body>
          <div class="container">
              <h4>Hello,</h4>
              <p>Thank you for registering for the full stack demo We're excited to have you on board. To complete your registration and verify your email, please click the button below:</p>
              <a href="http://localhost:3002/auth/verify?token=${token}" class="button">Verify Email</a>
              <p>If you didn't request this, please ignore this email or notify us.</p>
          </div>
      </body>
      </html>`,
    };

    const info = await transporter.sendMail(mailOptions);

    Logger.log('Message sent: %s', info.messageId);

    Logger.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('Email does not exist', HttpStatus.NOT_FOUND);
    }

    const resetToken = uuidv4();
    const expireTime = new Date(Date.now() + 3600000); // 1 hour from now

    await this.prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: expireTime,
      },
    });

    await this.sendResetEmail(email, resetToken);
  }

  private async sendResetEmail(email: string, token: string): Promise<void> {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const resetUrl = `http:/localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
      from: '"no-reply@maxiphy.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
          .container { background-color: #ffffff; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
          h4 { color: #333333; }
          p { color: #666666; }
          a.button { background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px; }
      </style>
      </head>
      <body>
          <div class="container">
              <p>You requested a password reset for your account.</p>
              <p>Please click on the following button, or paste this into your browser to complete the process:</p>
              <a href="${resetUrl}" class="button">Change Password</a>
              <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          </div>
      </body>
      </html>`,
    };

    const info = await transporter.sendMail(mailOptions);

    Logger.log('Password reset email sent: %s', info.messageId);

    Logger.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });
    Logger.log(user);
    if (!user) {
      throw new HttpException(
        'Invalid or expired reset token',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: '',
        passwordResetExpires: null,
      },
    });
  }
}
