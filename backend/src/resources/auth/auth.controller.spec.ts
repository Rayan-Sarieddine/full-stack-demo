import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { ExecutionContext } from '@nestjs/common';

const mockAuthService = {
  register: jest.fn((email, password, fullName, userType) => {
    return { id: 1, email, password, fullName, userType };
  }),
  verifyEmail: jest.fn(),
  login: jest.fn((user) => {
    return { accessToken: 'test-token', ...user };
  }),
  sendPasswordResetEmail: jest.fn(),
  resetPassword: jest.fn(),
};

class MockLocalAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useClass(MockLocalAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      expect(
        await controller.register({
          email: 'test@test.com',
          password: 'password',
          fullName: 'Test User',
          userType: 'USER',
        }),
      ).toEqual({
        id: expect.any(Number),
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test User',
        userType: 'USER',
      });
      expect(mockAuthService.register).toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('should verify email and redirect', async () => {
      const mockRes = { redirect: jest.fn() };
      await controller.verifyEmail('token', mockRes);
      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith('token');
      expect(mockRes.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/email-verified',
      );
    });
  });

  describe('login', () => {
    it('should return access token on successful login', async () => {
      const user = { userId: 1, email: 'test@test.com' };
      const req = { user };
      mockAuthService.login.mockResolvedValue({
        accessToken: 'some-access-token',
        ...user,
      });

      await expect(controller.login(req)).resolves.toEqual({
        accessToken: expect.any(String),
        userId: user.userId,
        email: user.email,
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
    });
  });

  describe('forgotPassword', () => {
    it('should initiate password reset process', async () => {
      const email = 'test@test.com';
      await controller.forgotPassword(email);
      expect(mockAuthService.sendPasswordResetEmail).toHaveBeenCalledWith(
        email,
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset the password successfully', async () => {
      const token = 'reset-token';
      const newPassword = 'newPassword';
      await controller.resetPassword(token, newPassword);
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
        token,
        newPassword,
      );
    });
  });
});
