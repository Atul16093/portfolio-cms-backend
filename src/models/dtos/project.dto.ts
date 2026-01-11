export class CreateProjectDto {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  featured?: boolean;
  published?: boolean;
}

export class UpdateProjectDto {
  title?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  featured?: boolean;
  published?: boolean;
}

export class ProjectResponseDto {
  id: string;
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

