import { z } from 'zod';

// Project schemas
export const createProjectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  imageUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  techStack: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectIdSchema = z.object({
  id: z.string().uuid(),
});

// Case Study schemas
export const createCaseStudySchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  content: z.string().min(1),
  projectId: z.string().uuid().optional(),
  imageUrl: z.string().url().optional(),
  published: z.boolean().default(false),
});

export const updateCaseStudySchema = createCaseStudySchema.partial();

export const caseStudyIdSchema = z.object({
  id: z.string().uuid(),
});

// Contact schemas
// Contact schemas
export const createContactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

export const contactIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid ID format'),
});

// Site Config schemas
export const updateSiteConfigSchema = z.object({
  siteName: z.string().min(1).max(255).optional(),
  siteDescription: z.string().min(1).optional(),
  contactEmail: z.string().email().optional(),
  socialLinks: z.record(z.string(), z.string().url()).optional(),
  metaTags: z.record(z.string(), z.string()).optional(),
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

