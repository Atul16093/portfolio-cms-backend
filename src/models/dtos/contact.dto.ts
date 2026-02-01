export class CreateContactDto {
  name: string;
  email: string;
  message: string;
}

export class ContactResponseDto {
  id: string; // or number, keeping string for now but DB is int
  uuid: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: Date;
  updatedAt?: Date; // Optional/missing in DB default?
}

