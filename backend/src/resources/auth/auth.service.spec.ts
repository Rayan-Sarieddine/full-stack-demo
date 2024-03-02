import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
const mockPrismaService = () => ({
  user: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
});
const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let prismaService;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useFactory: mockPrismaService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      prismaService.user.create.mockResolvedValue({
        id: 'someId',
        email: 'test@example.com',
        fullName: 'Test User',
        userType: 'USER',
      });
      expect(
        service.register('test@example.com', 'Password1!', 'Test User', 'USER'),
      ).resolves.not.toThrow();
    });

    it('should throw an exception if the user already exists', async () => {
      prismaService.user.create.mockRejectedValue(
        new HttpException('User already exists', 400),
      );
      await expect(
        service.register('test@example.com', 'Password1!', 'Test User', 'USER'),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify the user email', async () => {
      prismaService.user.findFirst.mockResolvedValue({
        id: 'someId',
        emailVerified: false,
      });
      prismaService.user.update.mockResolvedValue({ emailVerified: true });

      await expect(service.verifyEmail('someToken')).resolves.toBe(true);
    });

    it('should throw an exception if token is invalid', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);
      await expect(service.verifyEmail('invalidToken')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return the user if validation is successful', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 545454,
        email: 'test@example.com',
        password: await bcrypt.hash('Password1!', 10),
        emailVerified: true,
      });

      await expect(
        service.validateUser('test@example.com', 'Password1!'),
      ).resolves.not.toBeNull();
    });

    it('should return null if user does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      await expect(
        service.validateUser('nonexistent@example.com', 'Password1!'),
      ).resolves.toBeNull();
    });
  });
});
