import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Endpoint } from '../../interfaces/endpoint.interface';
import { Connector } from '../../interfaces/connector.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class RegistrationService implements OnApplicationBootstrap {
  constructor(private http: HttpService, private config: ConfigService) {}

  onApplicationBootstrap(): any {
    // if (this.config.get<string>('k_service')) {
    //   this.getCloudRunUrl().subscribe((data) => {
    //     console.log(data);
    //   });
    // }
    if (this.config.get<string>('k_service')) {
      const serviceData = this.getCloudRunUrl();
      console.log('Data: ' + serviceData);
    }
    // this.register().subscribe((data) => {
    //   console.log(data);
    // });
    const data = this.register();
    console.log('Data: ' + data);
  }

  getCloudRunUrl() {
    const usEast4 = 'us-east4-run.googleapis.com';
    const google = 'run.googleapis.com';
    const endpoint = usEast4;
    const requestUrl =
      'https://' +
      endpoint +
      '/apis/serving.knative.dev/v1/' +
      this.config.get<string>('k_service');
    console.log('GCR Request URL: ' + requestUrl);
    // return this.http.get(requestUrl).pipe(map((response) => response.data));
    return this.http
      .get(requestUrl)
      .toPromise()
      .then((res) => res.data)
      .catch((err) => console.log('Cloud Run Error: ' + err));
  }

  async register() {
    const baseUrl =
      'http://' +
      this.config.get<string>('ipAddress') +
      ':' +
      this.config.get<string>('port');

    const configEndpoint: Endpoint = {
      name: 'config',
      address: this.config.get<string>('ipAddress'),
      port: this.config.get<string>('port'),
      path: '/config',
    };

    const infoEndpoint: Endpoint = {
      name: 'info',
      address: this.config.get<string>('ipAddress'),
      port: this.config.get<string>('port'),
      path: '/info',
    };

    const connector: Connector = {
      base_url: baseUrl,
      description: this.config.get<string>('displayName'),
      endpoints: [infoEndpoint, configEndpoint],
      name: this.config.get<string>('name'),
      version: '1.0',
    };
    // try {
    // return this.http
    //   .post(this.config.get<string>('registrationUrl'), connector)
    //   .pipe(map((response) => response.data));
    console.log(
      'Registering Connector: ' + this.config.get<string>('registrationUrl'),
    );
    return this.http
      .post(this.config.get<string>('registrationUrl'), connector)
      .toPromise()
      .then((res) => res.data)
      .catch((err) => console.log('Registration Error: ' + err));
    // } catch (err) {
    //   throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    // }
  }
}
