import { Injectable, Logger } from '@nestjs/common';
import { Connector } from '../../interfaces/connector.interface';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);

  private urlToRegister: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  getUrlToRegister() {
    return this.urlToRegister;
  }

  setUrlToRegister(url: string) {
    this.urlToRegister = url;
  }

  async register(): Promise<any> {

    const registrationUrl = this.config.get('registrationUrl');  // i.e. the registry location

    const connector: Connector = {
      name: this.config.get<string>('name'),
      provider: this.config.get<string>('provider'),
      version: this.config.get<string>('version'),
      url: this.urlToRegister,
      displayName: this.config.get<string>('displayName'),
      company: this.config.get<string>('company'),
      description: this.config.get<string>('description'),
    };

    this.logger.log(
      `Registering connector at [${this.urlToRegister}] with registry [${registrationUrl}]`,
    );

    this.logger.log(connector);
    this.logger.log(registrationUrl);

    return this.http.post(registrationUrl, connector);
  }
}
