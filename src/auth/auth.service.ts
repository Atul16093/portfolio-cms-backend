import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AdminUserQuery } from '../models/queries/admin-user.query';
import { AdminSessionQuery } from '../models/queries/admin-session.query';
import { LoginDto } from '../dtos/auth/login.dto';
import { RefreshTokenDto } from '../dtos/auth/refresh-token.dto';

export interface TokenPayload {
  sub: number; // admin user id
  email: string;
  sessionId: string;
  type: 'access' | 'refresh';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  admin: {
    id: number;
    email: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private adminUserQuery: AdminUserQuery,
    private adminSessionQuery: AdminSessionQuery,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private getAuthConfig() {
    return this.configService.get('auth.jwt');
  }

  /**
   * Hash a token using SHA-256
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return crypto.randomUUID();
  }

  /**
   * Parse JWT expiry string (e.g., "15m", "7d", "1h") and calculate expiry date
   */
  private calculateExpiryDate(expiresIn: string): Date {
    const now = new Date();
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      // Default to 15 minutes if format is invalid
      now.setMinutes(now.getMinutes() + 15);
      return now;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        now.setSeconds(now.getSeconds() + value);
        break;
      case 'm':
        now.setMinutes(now.getMinutes() + value);
        break;
      case 'h':
        now.setHours(now.getHours() + value);
        break;
      case 'd':
        now.setDate(now.getDate() + value);
        break;
      default:
        now.setMinutes(now.getMinutes() + 15);
    }

    return now;
  }

  /**
   * Login: Validate credentials and create session
   */
  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    // Find admin user by email
    const adminUser = await this.adminUserQuery.findByEmail(loginDto.email);
    if (!adminUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!adminUser.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, adminUser.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate session ID
    const sessionId = this.generateSessionId();

    // Generate tokens
    const authConfig = this.getAuthConfig();
    const accessTokenPayload: TokenPayload = {
      sub: adminUser.id,
      email: adminUser.email,
      sessionId,
      type: 'access',
    };

    const refreshTokenPayload: TokenPayload = {
      sub: adminUser.id,
      email: adminUser.email,
      sessionId,
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: authConfig.accessTokenSecret,
      expiresIn: authConfig.accessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: authConfig.refreshTokenSecret,
      expiresIn: authConfig.refreshTokenExpiresIn,
    });

    // Calculate expiry dates from config
    const accessTokenExpiresAt = this.calculateExpiryDate(authConfig.accessTokenExpiresIn);
    const refreshTokenExpiresAt = this.calculateExpiryDate(authConfig.refreshTokenExpiresIn);

    // Hash tokens before storing
    const accessTokenHash = this.hashToken(accessToken);
    const refreshTokenHash = this.hashToken(refreshToken);

    // Create session record
    await this.adminSessionQuery.create({
      adminUserId: adminUser.id,
      sessionId,
      accessTokenHash,
      refreshTokenHash,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
      ipAddress,
      userAgent,
    });

    // Update last login
    await this.adminUserQuery.updateLastLoginAt(adminUser.id);

    return {
      accessToken,
      refreshToken,
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      },
    };
  }

  /**
   * Refresh: Validate refresh token and issue new access token
   */
  async refresh(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify and decode refresh token
    let payload: TokenPayload;
    try {
      const authConfig = this.getAuthConfig();
      payload = this.jwtService.verify<TokenPayload>(refreshTokenDto.refreshToken, {
        secret: authConfig.refreshTokenSecret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Hash the provided refresh token to find session
    const refreshTokenHash = this.hashToken(refreshTokenDto.refreshToken);

    // Find session by refresh token hash
    const session = await this.adminSessionQuery.findByRefreshTokenHash(refreshTokenHash);
    if (!session) {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    // Verify session ID matches
    if (session.sessionId !== payload.sessionId) {
      throw new UnauthorizedException('Session mismatch');
    }

    // Get admin user
    const adminUser = await this.adminUserQuery.findByUserId(payload.sub);
    if (!adminUser || !adminUser.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Generate new tokens (rotate refresh token)
    const authConfig = this.getAuthConfig();
    const newAccessTokenPayload: TokenPayload = {
      sub: adminUser.id,
      email: adminUser.email,
      sessionId: session.sessionId,
      type: 'access',
    };

    const newRefreshTokenPayload: TokenPayload = {
      sub: adminUser.id,
      email: adminUser.email,
      sessionId: session.sessionId,
      type: 'refresh',
    };

    const newAccessToken = this.jwtService.sign(newAccessTokenPayload, {
      secret: authConfig.accessTokenSecret,
      expiresIn: authConfig.accessTokenExpiresIn,
    });

    const newRefreshToken = this.jwtService.sign(newRefreshTokenPayload, {
      secret: authConfig.refreshTokenSecret,
      expiresIn: authConfig.refreshTokenExpiresIn,
    });

    // Calculate new expiry dates from config
    const newAccessTokenExpiresAt = this.calculateExpiryDate(authConfig.accessTokenExpiresIn);
    const newRefreshTokenExpiresAt = this.calculateExpiryDate(authConfig.refreshTokenExpiresIn);

    // Hash new refresh token
    const newRefreshTokenHash = this.hashToken(newRefreshToken);

    // Update session with new refresh token
    await this.adminSessionQuery.updateRefreshToken(
      session.sessionId,
      newRefreshTokenHash,
      newRefreshTokenExpiresAt,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout: Revoke session
   */
  async logout(accessToken: string): Promise<void> {
    // Verify and decode access token
    let payload: TokenPayload;
    try {
      const authConfig = this.getAuthConfig();
      payload = this.jwtService.verify<TokenPayload>(accessToken, {
        secret: authConfig.accessTokenSecret,
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    // Find session by session ID
    const session = await this.adminSessionQuery.findBySessionId(payload.sessionId);
    if (!session) {
      // Session not found, but we'll consider it logged out
      return;
    }

    // Revoke session
    await this.adminSessionQuery.revokeSession(payload.sessionId);
  }

  /**
   * Validate access token and return payload
   */
  async validateAccessToken(accessToken: string): Promise<TokenPayload> {
    try {
      const authConfig = this.getAuthConfig();
      const payload = this.jwtService.verify<TokenPayload>(accessToken, {
        secret: authConfig.accessTokenSecret,
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Verify session exists and is not revoked
      const session = await this.adminSessionQuery.findBySessionId(payload.sessionId);
      if (!session || session.isRevoked) {
        throw new UnauthorizedException('Session not found or revoked');
      }

      // Check if access token is expired in database
      if (session.accessTokenExpiresAt < new Date()) {
        throw new UnauthorizedException('Access token expired');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}

