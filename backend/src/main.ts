import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// Trigger rebuild
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuramos CORS de forma explícita para evitar bloqueos del navegador
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3002'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend de Crea Arte desde el Amor corriendo en: http://localhost:${port}`);
}
bootstrap();
