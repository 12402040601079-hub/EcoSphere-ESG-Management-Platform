import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, // Connects to the database
    private jwtService: JwtService // Handles token generation
  ) {}

  // Authenticates a user by email and password
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      // Don't return the password hash in the payload
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  // Generates a JWT token for the authenticated user
  async login(user: any) {
    // Payload includes standard sub (subject id), email, role, and department
    const payload = { email: user.email, sub: user.id, role: user.role, departmentId: user.departmentId };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET || 'super-secret-key-for-dev' }),
    };
  }
}
