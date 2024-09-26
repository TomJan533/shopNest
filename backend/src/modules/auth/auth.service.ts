import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { JwtPayload } from './jwt-payload.interface.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}


  private hasPassword(user: User | Omit<User, 'password'>): user is User {
    return 'password' in user;
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email, false); 
    if (user && this.hasPassword(user) && await bcrypt.compare(password, user.password)) {
      return this.usersService.omitPassword(user);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: Omit<User, 'password'>): Promise<{ access_token: string }> {
    const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
