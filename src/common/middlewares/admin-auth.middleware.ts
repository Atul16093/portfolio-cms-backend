import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services/auth/auth.service';

/**
 * Extend Express Request to include admin user info
 */
declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: number;
        email: string;
        sessionId: string;
      };
    }
  }
}

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header required');
    }

    const accessToken = authorization.substring(7);

    try {
      const payload = await this.authService.validateAccessToken(accessToken);

      // Attach admin info to request
      req.admin = {
        id: payload.sub,
        email: payload.email,
        sessionId: payload.sessionId,
      };

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}

