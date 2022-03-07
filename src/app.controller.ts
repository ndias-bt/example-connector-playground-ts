import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  HttpService,
  Render,
  Param,
  UseInterceptors,
  Logger,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Identity } from './interfaces/identity.interface';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from './services/settings/settings.service';
import { Request, Response } from 'express';
import { Data } from './interfaces/data.interface';
import { map } from 'rxjs/operators';
import {
  ApiOperation,
  ApiParam,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

const ORG = 'org';
const OBJECT = 'object';
const OBJECT_ID = 'object_id';
const ZIP = 'zip';

@Controller()
export class AppController {
  logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private config: ConfigService,
    private settingsService: SettingsService,
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
  @ApiResponse({
    status: 200,
    description: 'Return JSON array containing a url',
  })
  getInfo(@Req() request: Request): Data {
    return {
      url: this.config.get('url') + '/weather',
    };

    // let originalUrl = request.originalUrl;
    // originalUrl = originalUrl.replace('/info', '/weather');
    // const url = request.protocol + '://' + request.get('host') + originalUrl;
    // return {
    //   url: url,
    // };
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
  @ApiResponse({
    status: 200,
    description: 'Return JSON array containing a url',
  })
  getConfig() {
    return {
      url: this.appService.getBaseUrl() + '/settings/view',
      view: this.appService.getBaseUrl() + '/settings/view',
      edit: this.appService.getBaseUrl() + '/settings/edit',
    };
  }

  @Get('settings/view')
  @Render('settingsView')
  async getSettingsView() {
    const openweather_api_key = await this.settingsService
      .findAll()
      .then((settings) => settings[0].value);

    this.logger.log('openweather api key:' + openweather_api_key);

    return {
      openweather_api_key: openweather_api_key,
    };
  }

  @Get('settings/edit')
  @Render('settingsEdit')
  async getSettingsEditForm() {
    const openweather_api_key = await this.settingsService
      .findAll()
      .then((settings) => settings[0].value);

    return {
      openweather_api_key: openweather_api_key,
    };
  }

  @Post('settings/edit')
  @Render('settingsView')
  @UseInterceptors(FileInterceptor('file'))
  processSettingsEditForm(@Body() formData) {
    this.settingsService.create({
      name: 'openweather_api_key',
      value: formData.openweather_api_key,
    });
    return {
      openweather_api_key: formData.openweather_api_key,
    };
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

  @Get('index')
  @Render('index')
  root() {
    return { message: 'Hello world!' };
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
