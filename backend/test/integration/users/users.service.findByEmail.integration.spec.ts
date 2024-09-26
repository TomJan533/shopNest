import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/modules/users/users.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import {  User } from '@prisma/client/index';

describe('UsersService Integration - findByEmail', () => {
  let service: UsersService;
  let prisma: PrismaClient;

  beforeAll(async () => {

    prisma = new PrismaClient();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return a user without the password field', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'password123';
    const createdUser: Omit<User, 'password'> = await service.createUser(email, password);

    // Act
    const foundUser: Omit<User, 'password'> | null = await service.findByEmail(email);

    // Assert
    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe(email);
    expect(foundUser?.id).toBe(createdUser.id);
    expect((foundUser as any).password).toBeUndefined(); // Assert password does not exist
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });
});
