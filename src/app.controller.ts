import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  HttpService,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Identity } from './interfaces/identity.interface';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Data } from './interfaces/data.interface';
import { map } from 'rxjs/operators';
import { ApiOperation, ApiParam, ApiPropertyOptional, ApiResponse } from '@nestjs/swagger';

const ORG = 'org';
const OBJECT = 'object';
const OBJECT_ID = 'object_id';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private config: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Get connector identification',
    description: 'Retrieve information about the connector',
  })
  @Get()
  @ApiResponse({ status: 200, description: 'Return JSON array of information' })
  getIdentity(): Identity {
    return {
      name: this.config.get<string>('name'),
      provider: this.config.get('provider'),
      version: this.config.get<string>('version'),
      url: this.config.get<string>('url'),

      displayName: this.config.get('displayName'),
      company: this.config.get<string>('company'),
      description: this.config.get('description'),

      icon: this.config.get<string>('url') + '/icon',
      hasConfig: true,
      hasInfo: true,
    };
  }

  @Get('env')
  getEnv(): string {
    return JSON.stringify(process.env);
  }

  @Get('icon')
  get(@Res() response: Response) {
    response.set('Content-Type', 'image/png');
    response.sendFile('icon.png', { root: './public' });
  }

  @Get('info')
  @ApiOperation({
    summary: 'Get information iframe url',
    description:
      'Retrieve a url that can be used to present information about the connector',
  })
  @ApiParam({
    name: 'org',
    type: 'string',
    description: 'The associated organization id',
    allowEmptyValue: true,
  })
  @ApiParam({
    name: 'object',
    type: 'string',
    description: 'The type of object to retrieve information for',
    allowEmptyValue: true,
  })
  @ApiParam({
    name: 'object_id',
    type: 'string',
    description: 'The object id to retrieve information for',
    allowEmptyValue: true,
  })
  @ApiResponse({ status: 200, description: 'Return JSON array containing a url' })
  getInfo(@Req() request: Request): Data {
    let orginalUrl = request.originalUrl;
    orginalUrl = orginalUrl.replace('/info', '/lorempicsum');
    const url = request.protocol + '://' + request.get('host') + orginalUrl;
    return {
      url: url,
    };
  }

  @Get('config')
  @ApiOperation({
    summary: 'Get configuration iframe url',
    description:
      'Retrieve a url that can be used to present configuration options for the connector',
  })
  @ApiParam({
    name: 'org',
    type: 'string',
    description: 'The associated organization id',
    allowEmptyValue: true,
  })
  @ApiParam({
    name: 'object',
    type: 'string',
    description: 'The type of object to retrieve information for',
    allowEmptyValue: true,
  })
  @ApiParam({
    name: 'object_id',
    type: 'string',
    description: 'The object id to retrieve information for',
    allowEmptyValue: true,
  })
  @ApiResponse({ status: 200, description: 'Return JSON array containing a url' })
  getConfig() {
    return {};
    // return {
    //   url:
    //       'http://' +
    //       this.configService.get<string>('ipAddress') +
    //       ':' +
    //       this.configService.get<string>('port') +
    //       '/form',
    // };
  }

  @Get('lorem-picsum')
  getLoremPicsum(@Res() response: Response) {

    const url = 'https://picsum.photos/200';

    const html = `<img src='${url}' height="200" width="200">`;
    response.set('Content-Type', 'text/html');
    response.send(html);

  }

  @Get('form')
  getForm(@Res() response: Response) {
    response.set('Content-Type', 'text/html');
    response.send(this.appService.getForm());
  }

  @Get('metadata')
  getMetadata(@Req() request: Request, @Res() response: Response) {
    // console.log(request);
    const data = {
      originalUrl: request.hostname,
      baseUrl: request.baseUrl,
    };
    response.set('Content-Type', 'application/json');
    response.send(data);
    // this.metadata().subscribe((data) => {
    //   response.set('Content-Type', 'application/json');
    //   response.send(data);
    // });
  }

  // metadata() {
  //   const baseUrl = 'http://metadata.google.internal/computeMetadata/v1';
  //   const headersRequest = {
  //     'Metadata-Flavor': 'Google',
  //   };
  //
  //   return this.http
  //     .get(baseUrl + '/instance/hostname', {
  //       headers: headersRequest,
  //     })
  //     .pipe(map((response) => response.data));
  // }
}
