import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenManagementRepository } from '../../domain/repository/TokenManagementRepository';

@Injectable()
export class JwtNestJSRepository implements TokenManagementRepository {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  validateToken(token: string): any {
    return this.jwtService.verify(token);
  }
}
