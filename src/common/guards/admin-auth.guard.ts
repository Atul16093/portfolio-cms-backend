import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';

/**
 * Guard for admin-only CMS APIs
 * Validates JWT access token and attaches admin info to request
 * Reuses AuthService.validateAccessToken() to ensure consistency
 */
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header required');
    }

    const accessToken = authorization.substring(7);

    try {
      const payload = await this.authService.validateAccessToken(accessToken);

      // Attach admin info to request for use in controllers/services
      request.admin = {
        id: payload.sub,
        email: payload.email,
        sessionId: payload.sessionId,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
