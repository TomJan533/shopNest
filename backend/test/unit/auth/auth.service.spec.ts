import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/modules/auth/auth.service';
import { UsersService } from '../../../src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService - validateUser', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            omitPassword: jest.fn(), // Add mock for omitPassword
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should return user data if credentials are valid', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mock findByEmail to return a user with the correct email and hashed password
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email,
      password: hashedPassword,
      role: 'CLIENT',
    });

    // Mock bcrypt.compare to return true (passwords match)
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Mock omitPassword to return the user without the password
    (usersService.omitPassword as jest.Mock).mockImplementation(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    const result = await authService.validateUser(email, password);

    // Type guard to handle null result
    if (result) {
      expect(result.email).toEqual(email);
    } else {
      throw new Error('Validation failed but should not have.');
    }
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const email = 'test@example.com';
    const password = 'wrongpassword';

    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email,
      password: await bcrypt.hash('correctpassword', 10),
      role: 'CLIENT',
    });

    // Mock bcrypt.compare to return false (passwords don't match)
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const email = 'nonexistent@example.com';
    const password = 'password123';

    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(authService.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
  });
});
