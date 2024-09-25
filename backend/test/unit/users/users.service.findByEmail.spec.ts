import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/modules/users/users.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { User } from '@prisma/client';

describe('UsersService - findByEmail', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return user without password if omitPassword is true', async () => {
    // Arrange
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword123',
      role: 'CLIENT',
    };

    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    // Act
    const result = await usersService.findByEmail('test@example.com', true);

    // Assert
    expect(result).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
    });
    expect((result as any).password).toBeUndefined();
  });

  it('should return user with password if omitPassword is false', async () => {
    // Arrange
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword123',
      role: 'CLIENT',
    };

    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    // Act
    const result = await usersService.findByEmail('test@example.com', false) as User;

    // Assert
    expect(result).toEqual(mockUser);
    expect(result?.password).toEqual(mockUser.password);
  });

  it('should return null if user does not exist', async () => {
    // Arrange
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Act
    const result = await usersService.findByEmail('nonexistent@example.com', true);

    // Assert
    expect(result).toBeNull();
  });
});
