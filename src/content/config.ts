import { defineCollection, z } from 'astro:content';

const events = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    location: z.string(),
    city: z.string(),
    type: z.enum(['festival','market','workshop','popup']),
    ticketUrl: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(true),
  }),
});

const workshops = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    emoji: z.string().default('🎨'),
    tagline: z.string(),
    description: z.string(),
    duration: z.string(),
    groupSize: z.string(),
    location: z.string(),
    available: z.boolean().default(true),
  }),
});

const products = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    originalPrice: z.number().optional(),
    badge: z.string().optional(),
    image: z.string().optional(),
    stripeProductId: z.string().optional(),
    stripePriceId: z.string().optional(),
    available: z.boolean().default(true),
  }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    handle: z.string(),
    text: z.string(),
    emoji: z.string().default('🌸'),
    featured: z.boolean().default(true),
  }),
});

export const collections = { events, workshops, products, testimonials };
