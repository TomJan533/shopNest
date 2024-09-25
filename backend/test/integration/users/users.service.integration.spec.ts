import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/modules/users/users.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

describe('UsersService Integration', () => {
  let service: UsersService;
  let prisma: PrismaClient;

  beforeAll(async () => {

    console.log('DATABASE_URL:', process.env.DATABASE_URL);

    // Set up a real Prisma client connected to the test database
    prisma = new PrismaClient();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await prisma.$disconnect();  // Disconnect Prisma after tests
  });

  it('should hash the password and create a user in the test database', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    const user = await service.createUser(email, password);

    const foundUser = await prisma.user.findUnique({
      where: { email: email },
    });

    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toEqual(email);
    expect(await bcrypt.compare(password, foundUser?.password || '')).toBe(true); // Check if the password matches the hashed password
  });

  afterEach(async () => {
    await prisma.user.deleteMany(); // Clean up the test data
  });
});
