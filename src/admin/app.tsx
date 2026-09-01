import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['en', 'sv'],
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};
