export interface TokenManagementRepository {
  generateToken(payload: any): string;
  validateToken(token: string): any;
}
