import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'creativesolace/creative-solace',
  },

  collections: {
    events: collection({
      label: 'Events & Markets',
      slugField: 'title',
      path: 'src/content/events/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Event Title' } }),
        date: fields.date({ label: 'Date' }),
        location: fields.text({ label: 'Location (venue name)' }),
        city: fields.text({ label: 'City' }),
        type: fields.select({
          label: 'Event Type',
          options: [
            { label: 'Festival', value: 'festival' },
            { label: 'Thrift Market', value: 'market' },
            { label: 'Workshop Night', value: 'workshop' },
            { label: 'Pop-up', value: 'popup' },
          ],
          defaultValue: 'festival',
        }),
        ticketUrl: fields.url({ label: 'Ticket / Info URL (optional)' }),
        image: fields.image({
          label: 'Event Image',
          directory: 'public/images/events',
          publicPath: '/images/events/',
        }),
        featured: fields.checkbox({ label: 'Show on homepage', defaultValue: true }),
      },
    }),

    workshops: collection({
      label: 'Workshops',
      slugField: 'title',
      path: 'src/content/workshops/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Workshop Name' } }),
        emoji: fields.text({ label: 'Emoji icon', defaultValue: '🎨' }),
        tagline: fields.text({ label: 'Short tagline (e.g. Most Popular)' }),
        description: fields.text({ label: 'Description', multiline: true }),
        duration: fields.text({ label: 'Duration (e.g. 2–3 hours)' }),
        groupSize: fields.text({ label: 'Group size (e.g. 6–25 people)' }),
        location: fields.text({ label: 'Location info (e.g. We come to you)' }),
        available: fields.checkbox({ label: 'Currently available', defaultValue: true }),
      },
    }),

    products: collection({
      label: 'Rhinestone Kits',
      slugField: 'title',
      path: 'src/content/products/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Kit Name' } }),
        description: fields.text({ label: 'Short description', multiline: true }),
        price: fields.number({ label: 'Price (€)', defaultValue: 44.99 }),
        originalPrice: fields.number({ label: 'Original price (€, for sale badge)', defaultValue: 69 }),
        badge: fields.text({ label: 'Badge text (e.g. Sale, New, Bestseller)' }),
        image: fields.image({
          label: 'Product Image',
          directory: 'public/images/products',
          publicPath: '/images/products/',
        }),
        stripeProductId: fields.text({ label: 'Stripe Product ID (from Stripe dashboard)' }),
        stripePriceId: fields.text({ label: 'Stripe Price ID (from Stripe dashboard)' }),
        available: fields.checkbox({ label: 'In stock', defaultValue: true }),
      },
    }),

    testimonials: collection({
      label: 'Testimonials',
      slugField: 'name',
      path: 'src/content/testimonials/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Customer name' } }),
        handle: fields.text({ label: 'Handle / context (e.g. @lisa · Bedazzle & Sip)' }),
        text: fields.text({ label: 'Review text', multiline: true }),
        emoji: fields.text({ label: 'Avatar emoji', defaultValue: '🌸' }),
        featured: fields.checkbox({ label: 'Show on homepage', defaultValue: true }),
      },
    }),
  },

  singletons: {
    homepage: singleton({
      label: 'Homepage Content',
      path: 'src/content/homepage',
      format: { data: 'json' },
      schema: {
        announcementBar: fields.text({ label: 'Announcement bar text' }),
        heroTitle: fields.text({ label: 'Hero headline (use | for line break)' }),
        heroSubtitle: fields.text({ label: 'Hero subtitle text', multiline: true }),
        trustCount: fields.text({ label: 'Trust line (e.g. 200+ happy creators · 50+ workshops)' }),
      },
    }),
  },
});
