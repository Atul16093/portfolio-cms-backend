export interface CaseStudyEntity {
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

