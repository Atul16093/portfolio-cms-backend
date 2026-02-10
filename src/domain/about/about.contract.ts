import { About, CreateAboutInput, UpdateAboutInput } from './about.types';

export interface IAboutRepository {
  createAbout(input: CreateAboutInput): Promise<About>;
  getAbout(uuid: string): Promise<About | null>;
  getActiveAbout(): Promise<About | null>;
  updateAbout(uuid: string, input: UpdateAboutInput): Promise<About>;
  deactivateAllExcept(uuid?: string): Promise<void>;
  getAll(): Promise<About[]>;
}
