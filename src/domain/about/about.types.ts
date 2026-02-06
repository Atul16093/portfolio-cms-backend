export interface About {
  id: number;
  uuid: string;
  name: string;
  title: string;
  shortIntro?: string | null;
  description?: string[] | null;
  yearsOfExperience?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAboutInput = Omit<About, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>;
export type UpdateAboutInput = Partial<Omit<About, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>>;
