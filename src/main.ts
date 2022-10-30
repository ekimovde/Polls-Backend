import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { UnauthorizedExceptionFilter } from './common/exceptions/unauthorized.exception';
import { DefaultExceptionFilter } from './common/exceptions/default.exception';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: ['content-type', 'accesstoken'],
    origin: process.env.FRONTED_API || 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalFilters(new DefaultExceptionFilter());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

bootstrap();
