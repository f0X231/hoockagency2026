import type { Schema, Struct } from '@strapi/strapi';

export interface HomeArticle extends Struct.ComponentSchema {
  collectionName: 'components_home_articles';
  info: {
    displayName: 'article';
    icon: 'pencil';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    link: Schema.Attribute.Text;
    no: Schema.Attribute.Integer;
    publishdate: Schema.Attribute.Date;
    title: Schema.Attribute.String;
  };
}

export interface HomePartner extends Struct.ComponentSchema {
  collectionName: 'components_home_partners';
  info: {
    displayName: 'partner';
    icon: 'cup';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface HomeService extends Struct.ComponentSchema {
  collectionName: 'components_home_services';
  info: {
    displayName: 'service';
    icon: 'server';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    imagefull: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    no: Schema.Attribute.Integer;
    title: Schema.Attribute.String;
  };
}

export interface HomeWork extends Struct.ComponentSchema {
  collectionName: 'components_home_works';
  info: {
    displayName: 'work';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    link: Schema.Attribute.Text;
    no: Schema.Attribute.Integer;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'home.article': HomeArticle;
      'home.partner': HomePartner;
      'home.service': HomeService;
      'home.work': HomeWork;
    }
  }
}
