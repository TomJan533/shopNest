import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/modules/auth/auth.controller';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return an access token for valid credentials', async () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    (authService.validateUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: loginDto.email,
      role: 'CLIENT',
    });

    (authService.login as jest.Mock).mockResolvedValue({ access_token: 'some-token' });

    const result = await authController.login(loginDto);

    expect(result).toEqual({ access_token: 'some-token' });
    expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    expect(authService.login).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    const loginDto = { email: 'wrong@example.com', password: 'wrongpassword' };

    (authService.validateUser as jest.Mock).mockResolvedValue(null);

    await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    expect(authService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    expect(authService.login).not.toHaveBeenCalled();
  });
});
