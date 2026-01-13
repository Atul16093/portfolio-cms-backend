import { ApiProperty } from '@nestjs/swagger';

export class AdminInfoDto {
  @ApiProperty({ description: 'Admin user ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Admin user email', example: 'admin@example.com' })
  email: string;

  @ApiProperty({ description: 'Admin user role', example: 'admin' })
  role: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({ description: 'Admin user information', type: AdminInfoDto })
  admin: AdminInfoDto;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ description: 'New JWT access token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ description: 'New JWT refresh token (rotated)', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;
}

export class StandardApiResponseDto<T = any> {
  @ApiProperty({ description: 'Indicates if the request was successful', example: true })
  success: boolean;

  @ApiProperty({ description: 'Response code', example: 'SUCCESS' })
  code: string;

  @ApiProperty({ description: 'Response message', example: 'Operation completed successfully' })
  message: string;

  @ApiProperty({ description: 'Response data', required: false })
  data?: T;

  @ApiProperty({ description: 'Error details (if any)', required: false, type: [Object] })
  errors?: any[];

  @ApiProperty({ description: 'Timestamp of the response', example: '2024-01-12T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ description: 'Request path', example: '/api/admin/auth/login', required: false })
  path?: string;
}

