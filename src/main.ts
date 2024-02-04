import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ConfigData } from './infra/services/MyConfigService';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './infra/middlewares/LoggingInterceptor';
import { patchNestJsSwagger } from 'nestjs-zod';

patchNestJsSwagger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('My CV API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const configService = app.get<ConfigService<ConfigData>>(ConfigService);
  const port = configService.get('port');

  await app.listen(port).then(() => {
    console.log(`Running on http://localhost:${port}`);
  });

  return { app };
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
