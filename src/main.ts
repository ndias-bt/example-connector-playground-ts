import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  // disable log colorization if running on google cloud run
  if (process.env.K_SERVICE) { process.env.NO_COLOR = 'true' }

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle(process.env.name)
      .setDescription(process.env.name)
      .setVersion(process.env.version)
      .addTag('connector')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
