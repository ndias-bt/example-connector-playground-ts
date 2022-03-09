import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { UrlDiscoveryService } from './services/url-discovery/url-discovery.service';
import { RegistrationService } from './services/registration/registration.service';
import { configuration } from './config/configuration'; // this is new
import * as Joi from 'joi';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),

    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
      load: [configuration],
      validationSchema: Joi.object({
        NAME: Joi.string().required(),
        PROVIDER: Joi.string().required(),
        VERSION: Joi.string().default('0.0.1'),

        URL: Joi.string().default('http://localhost'),

        DISPLAY_NAME: Joi.string().default(''),
        COMPANY: Joi.string().default(''),
        DESCRIPTION: Joi.string().default(''),

        REGISTRATION_URL: Joi.string().default(
          'https://service-connector-registry-xzww6y6oeq-uc.a.run.app/v1/connectors',
        ),
      }),
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UrlDiscoveryService,
    RegistrationService,
  ],
})
export class AppModule {}
