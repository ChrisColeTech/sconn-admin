import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '@/database/connection.js';
import type { 
  AdminUser, 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenRequest, 
  RefreshTokenResponse,
  JWTPayload,
  RefreshToken 
} from '@/types/auth.js';

export class AuthService {
  private db = getDatabase();

  private get jwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    return secret;
  }

  private get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '8h';
  }

  private get refreshExpiresIn(): string {
    return process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { username, password, rememberMe } = credentials;

    // Find user by username
    const userRow = await this.db.get<any>(
      'SELECT * FROM admin_users WHERE username = ? AND is_active = 1',
      [username]
    );

    if (!userRow) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userRow.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Parse roles and permissions
    const roles = JSON.parse(userRow.roles);
    const permissions = JSON.parse(userRow.permissions);

    // Generate JWT token
    const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
      sub: userRow.id,
      username: userRow.username,
      email: userRow.email,
      roles,
      permissions
    };

    const token = jwt.sign(tokenPayload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });

    // Generate refresh token
    const refreshToken = await this.generateRefreshToken(userRow.id, rememberMe);

    // Update last login
    await this.db.run(
      'UPDATE admin_users SET last_login_at = ? WHERE id = ?',
      [new Date().toISOString(), userRow.id]
    );

    // Calculate token expiration
    const decoded = jwt.decode(token) as JWTPayload;
    const expiresAt = new Date(decoded.exp * 1000).toISOString();

    return {
      success: true,
      data: {
        user: {
          id: userRow.id,
          username: userRow.username,
          email: userRow.email,
          roles,
          permissions
        },
        token,
        refreshToken: refreshToken.token,
        expiresAt
      }
    };
  }

  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const { refreshToken } = request;

    // Find refresh token in database
    const tokenRow = await this.db.get<any>(
      `SELECT rt.*, au.id, au.username, au.email, au.roles, au.permissions 
       FROM refresh_tokens rt 
       JOIN admin_users au ON rt.user_id = au.id 
       WHERE rt.token = ? AND rt.expires_at > ? AND au.is_active = 1`,
      [refreshToken, new Date().toISOString()]
    );

    if (!tokenRow) {
      throw new Error('Invalid or expired refresh token');
    }

    // Parse user data
    const roles = JSON.parse(tokenRow.roles);
    const permissions = JSON.parse(tokenRow.permissions);

    // Generate new JWT token
    const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
      sub: tokenRow.id,
      username: tokenRow.username,
      email: tokenRow.email,
      roles,
      permissions
    };

    const newToken = jwt.sign(tokenPayload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });

    // Calculate token expiration
    const decoded = jwt.decode(newToken) as JWTPayload;
    const expiresAt = new Date(decoded.exp * 1000).toISOString();

    return {
      success: true,
      data: {
        token: newToken,
        expiresAt
      }
    };
  }

  async logout(refreshToken: string): Promise<void> {
    // Remove refresh token from database
    await this.db.run(
      'DELETE FROM refresh_tokens WHERE token = ?',
      [refreshToken]
    );
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      
      // Verify user still exists and is active
      const user = await this.db.get(
        'SELECT id FROM admin_users WHERE id = ? AND is_active = 1',
        [decoded.sub]
      );

      if (!user) {
        throw new Error('User no longer exists or is inactive');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private async generateRefreshToken(userId: string, rememberMe?: boolean): Promise<RefreshToken> {
    const tokenId = uuidv4();
    const token = uuidv4();
    
    // Set expiration (longer if remember me is checked)
    const expiresAt = new Date();
    if (rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
    } else {
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    }

    const refreshToken: RefreshToken = {
      id: tokenId,
      userId,
      token,
      expiresAt,
      createdAt: new Date()
    };

    // Clean up expired tokens for this user
    await this.db.run(
      'DELETE FROM refresh_tokens WHERE user_id = ? AND expires_at <= ?',
      [userId, new Date().toISOString()]
    );

    // Store refresh token
    await this.db.run(
      'INSERT INTO refresh_tokens (id, user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?, ?)',
      [refreshToken.id, refreshToken.userId, refreshToken.token, 
       refreshToken.expiresAt.toISOString(), refreshToken.createdAt.toISOString()]
    );

    return refreshToken;
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.db.run(
      'DELETE FROM refresh_tokens WHERE expires_at <= ?',
      [new Date().toISOString()]
    );
  }
}

export const authService = new AuthService();