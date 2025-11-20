import { z } from 'zod';

// ISO8601 date format (YYYY-MM-DD)
const iso8601 = z.string().regex(/^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$/);

// Generator configuration schema
export const GeneratorConfigSchema = z.object({
  name: z.string().optional(),
  config: z.record(z.any()).optional(),
}).strict();

// Core blog schema
export const BlogSchema = z.object({
  $schema: z.string().url().optional(),
  site: z.object({
    title: z.string(),
    description: z.string().optional(),
  }).catchall(z.any()),

  basics: z.object({
    name: z.string(),
    label: z.string().optional(),
    image: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    url: z.string().url().optional(),
  }).catchall(z.any()),

  // Generator configuration
  generator: GeneratorConfigSchema.optional(),

  posts: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    source: z.string().optional(),
    createdAt: iso8601.optional(),
    updatedAt: iso8601.optional(),
  }).catchall(z.any())),

  pages: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    source: z.string().optional(),
    createdAt: iso8601.optional(),
    updatedAt: iso8601.optional(),
  }).catchall(z.any())).optional(),

  settings: z.object({
    postsPerPage: z.number().optional(),
  }).catchall(z.any()).optional(),
}).strict();

// Type inference
export type GeneratorConfig = z.infer<typeof GeneratorConfigSchema>;
export type Blog = z.infer<typeof BlogSchema>;

// Validation function
export async function validateBlog(blog: unknown): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.resolve(BlogSchema.parseAsync(blog));
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n')
      };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}
