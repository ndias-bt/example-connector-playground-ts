// configuration.ts

import * as os from 'os';

export const configuration = () => ({
  name: process.env.NAME,
  provider: process.env.PROVIDER,
  version: process.env.VERSION,

  url: process.env.URL,

  displayName: process.env.DISPLAY_NAME,
  company: process.env.COMPANY,
  description: process.env.DESCRIPTION,

  hostname: os.hostname(),
  registrationUrl: process.env.REGISTRATION_URL,
  k_service: process.env.K_SERVICE,
});
