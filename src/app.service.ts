import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Customer } from './interfaces/customer.interface';
import { ConfigService } from '@nestjs/config';
import { UrlDiscoveryService } from './services/url-discovery/url-discovery.service';
import { RegistrationService } from './services/registration/registration.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  private baseUrl: string;
  private customer: Customer;

  constructor(
    private readonly config: ConfigService,
    private readonly urlDiscoveryService: UrlDiscoveryService,
    private readonly registrationService: RegistrationService,
  ) {}

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  async onApplicationBootstrap(): Promise<any> {
    try {
      this.setBaseUrl(await this.urlDiscoveryService.getConnectorUrl());
      this.registrationService.setUrlToRegister(this.baseUrl);
      const response$ = await this.registrationService.register();
      response$.subscribe((response) => {
        this.logger.log('=== Connector Registration Response ===');
        this.logger.log(`statusCode: ${response.status}`);
        this.logger.log(response.data);
      });
    } catch (error) {
      this.logger.log(error);
    }
  }

  setCustomer(customer: Customer): void {
    this.customer = customer;
  }

  getForm(): string {
    const target = this.baseUrl + '/form';
    let html = '<h2>Sample Form</h2>';
    html += `<form method="POST" action="${target}">`;
    html += '<label for="name">Name:</label>';
    html += '<input type="text" id="name" name="name" value="John Smith">';
    html += '<br>';
    html += '<label for="email">Email:</label>';
    html += '<input type="text" id="email" name="email" value="">';
    return html;
  }
}
