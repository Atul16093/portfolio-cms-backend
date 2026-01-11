export class CreateContactDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class ContactResponseDto {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

