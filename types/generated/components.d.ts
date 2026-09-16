import type { Schema, Struct } from '@strapi/strapi';

export interface FooterLinkColumn extends Struct.ComponentSchema {
  collectionName: 'components_footer_link_columns';
  info: {
    description: 'A titled column of footer links.';
    displayName: 'Footer Column';
    icon: 'bulletList';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.nav-link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_homepage_cta_buttons';
  info: {
    description: 'A call-to-action button with label and destination href.';
    displayName: 'CTA Button';
    icon: 'cursor';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomepageProductCard extends Struct.ComponentSchema {
  collectionName: 'components_homepage_product_cards';
  info: {
    description: 'A featured product or service card on the homepage grid.';
    displayName: 'Product Card';
    icon: 'layout';
  };
  attributes: {
    description: Schema.Attribute.Text;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PagesListItem extends Struct.ComponentSchema {
  collectionName: 'components_pages_list_items';
  info: {
    description: 'A simple text item for repeatable bullet-point lists.';
    displayName: 'List Item';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PagesSegmentCard extends Struct.ComponentSchema {
  collectionName: 'components_pages_segment_cards';
  info: {
    description: 'A product-segment chooser card (Privat/F\u00F6retag) with title, description, and image.';
    displayName: 'Segment Card';
    icon: 'layout';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PagesServiceCard extends Struct.ComponentSchema {
  collectionName: 'components_pages_service_cards';
  info: {
    description: 'A support-section service card with title, description, and button label.';
    displayName: 'Service Card';
    icon: 'server';
  };
  attributes: {
    btnLabel: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_items';
  info: {
    description: 'Top-level navigation item \u2014 plain link or dropdown group with children.';
    displayName: 'Nav Item';
    icon: 'layer';
  };
  attributes: {
    children: Schema.Attribute.Component<'shared.nav-link', true>;
    href: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_links';
  info: {
    description: 'A single navigation link (label + href).';
    displayName: 'Nav Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface StatusChangelogEntry extends Struct.ComponentSchema {
  collectionName: 'components_status_changelog_entries';
  info: {
    displayName: 'Changelog Entry';
    icon: 'list';
  };
  attributes: {
    date: Schema.Attribute.Date;
    description: Schema.Attribute.Text;
    entryType: Schema.Attribute.Enumeration<['feature', 'fix', 'maintenance']>;
    version: Schema.Attribute.String;
  };
}

export interface StatusIncident extends Struct.ComponentSchema {
  collectionName: 'components_status_incidents';
  info: {
    displayName: 'Incident';
    icon: 'exclamation-circle';
  };
  attributes: {
    date: Schema.Attribute.Date;
    description: Schema.Attribute.Text;
    incidentStatus: Schema.Attribute.Enumeration<
      ['investigating', 'identified', 'monitoring', 'resolved']
    >;
    title: Schema.Attribute.String;
  };
}

export interface StatusSystem extends Struct.ComponentSchema {
  collectionName: 'components_status_systems';
  info: {
    displayName: 'System';
    icon: 'server';
  };
  attributes: {
    description: Schema.Attribute.String;
    name: Schema.Attribute.String;
    slug: Schema.Attribute.String;
    status: Schema.Attribute.Enumeration<
      ['operational', 'degraded', 'down', 'maintenance']
    >;
    uptime: Schema.Attribute.Decimal;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'footer.link-column': FooterLinkColumn;
      'homepage.cta-button': HomepageCtaButton;
      'homepage.product-card': HomepageProductCard;
      'pages.list-item': PagesListItem;
      'pages.segment-card': PagesSegmentCard;
      'pages.service-card': PagesServiceCard;
      'shared.nav-item': SharedNavItem;
      'shared.nav-link': SharedNavLink;
      'status.changelog-entry': StatusChangelogEntry;
      'status.incident': StatusIncident;
      'status.system': StatusSystem;
    }
  }
}
