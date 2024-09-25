import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/modules/users/users.service';
import { PrismaService } from '../../../src/prisma/prisma.service'; // Include PrismaService
import { PrismaClient } from '@prisma/client';

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

  it('should find a user by their email after creating them', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'password123';
    const createdUser = await service.createUser(email, password);

    // Act
    const foundUser = await service.findByEmail(email);

    // Assert
    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe(email);
    expect(foundUser?.id).toBe(createdUser.id);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });
});
