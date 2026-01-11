export class CreateCaseStudyDto {
  title: string;
  description: string;
  slug: string;
  content: string;
  projectId?: string;
  imageUrl?: string;
  published?: boolean;
}

export class UpdateCaseStudyDto {
  title?: string;
  description?: string;
  slug?: string;
  content?: string;
  projectId?: string;
  imageUrl?: string;
  published?: boolean;
}

export class CaseStudyResponseDto {
  id: string;
  title: string;
  description: string;
  slug: string;
  content: string;
  projectId?: string;
  imageUrl?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

