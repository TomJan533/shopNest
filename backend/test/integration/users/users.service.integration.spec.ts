import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/modules/users/users.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

describe('UsersService Integration', () => {
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

  it('should hash the password and create a user in the test database', async () => {
    // Arrange
    const email = 'testcreateuser@example.com';
    const password = 'password123';
    await service.createUser(email, password);

    // Act
    const foundUser = await prisma.user.findUnique({
      where: { email: email },
    });

    // Assert
    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toEqual(email);
    expect(await bcrypt.compare(password, foundUser?.password || '')).toBe(true); // Check if the password matches the hashed password
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });
});
