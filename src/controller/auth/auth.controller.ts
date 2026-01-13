import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import { loginSchema, LoginDto, LoginRequestDto } from '../../dtos/auth/login.dto';
import { refreshTokenSchema, RefreshTokenDto, RefreshTokenRequestDto } from '../../dtos/auth/refresh-token.dto';
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
  StandardApiResponseDto,
} from '../../dtos/auth/auth-response.dto';

@ApiTags('auth')
@Controller('admin/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private responseService: ResponseService,
  ) {}

  /**
   * Extract IP address from request
   */
  private getIpAddress(req: Request): string | undefined {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.ip ||
      req.socket.remoteAddress
    );
  }

  /**
   * Extract user agent from request
   */
  private getUserAgent(req: Request): string | undefined {
    return req.headers['user-agent'];
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin login',
    description: 'Authenticate admin user with email and password. Returns access token and refresh token.',
  })
  @ApiBody({
    type: LoginRequestDto,
    description: 'Admin credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: StandardApiResponseDto<LoginResponseDto>,
  })

  async login(
    @Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto,
    @Req() req: Request,
  ) {
    const ipAddress = this.getIpAddress(req);
    const userAgent = this.getUserAgent(req);

    const result = await this.authService.login(loginDto, ipAddress, userAgent);

    return this.responseService.success(result, 'Login successful');
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate new access token and rotate refresh token using a valid refresh token.',
  })
  @ApiBody({
    type: RefreshTokenRequestDto,
    description: 'Refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: StandardApiResponseDto<RefreshTokenResponseDto>,
  })

  async refresh(
    @Body(new ZodValidationPipe(refreshTokenSchema)) refreshTokenDto: RefreshTokenDto,
  ) {
    const result = await this.authService.refresh(refreshTokenDto);

    return this.responseService.success(result, 'Token refreshed successfully');
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout',
    description: 'Revoke current session and invalidate refresh token. Requires valid access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    type: StandardApiResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing access token',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'string', example: 'UNAUTHORIZED' },
        message: { type: 'string', example: 'Authorization header required' },
        timestamp: { type: 'string' },
        path: { type: 'string' },
      },
    },
  })
  async logout(@Req() req: Request) {
    // Extract authorization header (Express normalizes headers to lowercase)
    const authorization = req.headers.authorization as string | undefined;

    if (!authorization) {
      return this.responseService.unauthorized('Authorization header required');
    }

    // Extract token - handle both "Bearer token" and "Bearer Bearer token" cases
    // Remove all "Bearer " prefixes (handles duplicate prefixes)
    let accessToken = authorization.trim();
    while (accessToken.toLowerCase().startsWith('bearer ')) {
      accessToken = accessToken.substring(7).trim();
    }

    if (!accessToken) {
      return this.responseService.unauthorized('Invalid authorization token');
    }

    await this.authService.logout(accessToken);

    return this.responseService.success(undefined, 'Logout successful');
  }
}

