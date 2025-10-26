export interface JwtPayload {
  // Standard claims
  sub: number; // userID
  iat: number; // issued at
  jti: string; // token ID
  exp?: number; // expiration (added automatically)

  // User claims
  userId: number;
  name: string;
  email: string;
  username: string;

  // Roles
  userRoles: Array<{
    roleId?: number;
    roleName?: string;
  }>;

  // Token metadata
  tokenType: 'access' | 'refresh';
  issuer: string;
}
export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}
