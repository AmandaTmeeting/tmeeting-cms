import type { Schema, Struct } from '@strapi/strapi';

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
      'status.changelog-entry': StatusChangelogEntry;
      'status.incident': StatusIncident;
      'status.system': StatusSystem;
    }
  }
}
