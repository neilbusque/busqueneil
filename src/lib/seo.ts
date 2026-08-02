export const SITE_URL = 'https://busqueneil.com';
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/#person`;
export const LOGO_ID = `${SITE_URL}/#logo`;
export const SOCIAL_IMAGE_ID = `${SITE_URL}/#social-image`;

export const LOGO_URL = `${SITE_URL}/assets/brand/icon-512.png`;
export const SOCIAL_IMAGE_URL = `${SITE_URL}/assets/brand/og-v13.png`;
export const PROFILE_IMAGE_URL = `${SITE_URL}/assets/art/neil-avatar.webp`;

export const WEBSITE_REF = { '@id': WEBSITE_ID };
export const ORGANIZATION_REF = { '@id': ORGANIZATION_ID };
export const PERSON_REF = { '@id': PERSON_ID };

export const LOGO = {
  '@type': 'ImageObject',
  '@id': LOGO_ID,
  url: LOGO_URL,
  contentUrl: LOGO_URL,
  width: 512,
  height: 512,
  caption: 'busqueneil Ribbon N logo',
};

export const SOCIAL_IMAGE = {
  '@type': 'ImageObject',
  '@id': SOCIAL_IMAGE_ID,
  url: SOCIAL_IMAGE_URL,
  contentUrl: SOCIAL_IMAGE_URL,
  width: 1200,
  height: 630,
  caption: 'Neil Busque, AI Engineer and Product Builder',
};

export const AUTHOR = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Neil Busque',
  url: `${SITE_URL}/story`,
};

export const PUBLISHER = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'busqueneil',
  url: `${SITE_URL}/`,
  logo: LOGO,
};
