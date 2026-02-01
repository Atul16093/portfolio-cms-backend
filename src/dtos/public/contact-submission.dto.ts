import { ApiProperty } from '@nestjs/swagger';

export class ContactSubmissionDto {
  @ApiProperty({ description: 'Name of the person contacting', example: 'John Doe', minLength: 2, maxLength: 100 })
  name!: string;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  email!: string;

  @ApiProperty({ description: 'Message content', example: 'Hello, I would like to work with you.', minLength: 10, maxLength: 2000 })
  message!: string;
}
