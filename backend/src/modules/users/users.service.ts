import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client/index';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Helper method to remove password from user object
  omitPassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createUser(email: string, password: string): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return this.omitPassword(createdUser);
  }

  async findByEmail(email: string, omitPassword: boolean = true): Promise<User | Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) return null;
  
    // Optionally return user without password
    return omitPassword ? this.omitPassword(user) : user;
  }
}
