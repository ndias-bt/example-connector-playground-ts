export interface Identity {
  name: string;
  provider: string;
  version: string;
  url: string;

  displayName: string;
  company: string;
  description: string;

  icon: string;
  hasConfig: boolean;
  hasInfo: boolean;
}
