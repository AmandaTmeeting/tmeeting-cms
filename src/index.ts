import type { Core } from '@strapi/strapi';

const LOCALES: { code: string; name: string }[] = [
  { code: 'ar', name: 'العربية' },
  { code: 'bg', name: 'Български' },
  { code: 'ca', name: 'Català' },
  { code: 'cs', name: 'Čeština' },
  { code: 'da', name: 'Dansk' },
  { code: 'de', name: 'Deutsch' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'et', name: 'Eesti' },
  { code: 'fa', name: 'فارسی' },
  { code: 'fi', name: 'Suomi' },
  { code: 'fr', name: 'Français' },
  { code: 'ga', name: 'Gaeilge' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'hu', name: 'Magyar' },
  { code: 'is', name: 'Íslenska' },
  { code: 'it', name: 'Italiano' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'lv', name: 'Latviešu' },
  { code: 'mk', name: 'Македонски' },
  { code: 'mt', name: 'Malti' },
  { code: 'nb', name: 'Norsk bokmål' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt', name: 'Português' },
  { code: 'ro', name: 'Română' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'sl', name: 'Slovenščina' },
  { code: 'so', name: 'Soomaali' },
  { code: 'sq', name: 'Shqip' },
  { code: 'sr', name: 'Српски' },
  { code: 'sv', name: 'Svenska' },
];

const DEFAULT_LOCALE = 'sv';

const PUBLIC_PERMISSIONS = [
  'api::product.product.find',
  'api::product.product.findOne',
  'api::service.service.find',
  'api::service.service.findOne',
  'api::news-article.news-article.find',
  'api::news-article.news-article.findOne',
  'api::support-document.support-document.find',
  'api::support-document.support-document.findOne',
  'api::site-setting.site-setting.find',
  'api::system-status.system-status.find',
];

async function setupPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    strapi.log.warn('[bootstrap] Public role not found — skipping permission setup');
    return;
  }

  for (const action of PUBLIC_PERMISSIONS) {
    const existing = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });

    if (existing) {
      if (!existing.enabled) {
        await strapi.db
          .query('plugin::users-permissions.permission')
          .update({ where: { id: existing.id }, data: { enabled: true } });
      }
    } else {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .create({ data: { action, enabled: true, role: publicRole.id } });
    }
  }

  strapi.log.info('[bootstrap] Public permissions set for product and service (find, findOne)');
}

async function setupLocales(strapi: Core.Strapi) {
  const localeService = strapi.plugin('i18n').service('locales');

  const existing: { code: string; id: number; isDefault: boolean }[] =
    await localeService.find();
  const existingCodes = new Set(existing.map((l) => l.code));

  for (const locale of LOCALES) {
    if (!existingCodes.has(locale.code)) {
      await localeService.create({ code: locale.code, name: locale.name });
    }
  }

  const allLocales: { code: string; id: number; isDefault: boolean }[] =
    await localeService.find();
  const defaultLocale = allLocales.find((l) => l.code === DEFAULT_LOCALE);

  if (defaultLocale && !defaultLocale.isDefault) {
    await localeService.setDefaultLocale({ id: defaultLocale.id });
    strapi.log.info(`[bootstrap] Default locale set to "${DEFAULT_LOCALE}" (Svenska)`);
  }

  strapi.log.info(
    `[bootstrap] i18n locales ready: ${allLocales.length} locales, default = "${DEFAULT_LOCALE}"`
  );
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setupLocales(strapi);
    await setupPublicPermissions(strapi);
  },
};
