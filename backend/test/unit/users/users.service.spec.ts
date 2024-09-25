import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/modules/users/users.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should hash the password and create a user', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = 'hashedpassword123';

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const createUserSpy = jest.spyOn(prismaService.user, 'create').mockResolvedValue({
      id: 1,
      email: email,
      password: hashedPassword,
      role: 'CLIENT',
    });

    const result = await service.createUser(email, password);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(createUserSpy).toHaveBeenCalledWith({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    expect(result).toEqual({
      id: 1,
      email: email,
      password: hashedPassword,
      role: 'CLIENT',
    });
  });
});
