import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security: Enable Helmet for security headers
  app.use(helmet());

  // CORS: Enable Cross-Origin Resource Sharing
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Body Parser: Configure global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are provided
      transform: true, // Transform payloads to DTO instances
      disableErrorMessages: process.env.NODE_ENV === 'production', // Hide error messages in production
    }),
  );

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription('API for managing tasks with filtering and sorting')
    .setVersion('1.0')
    .addTag('tasks', 'Task management endpoints')
    .addServer('http://localhost:8000', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 8000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 8000}`);
  console.log(`Swagger UI is available at: http://localhost:${process.env.PORT ?? 8000}/api/docs`);
}
bootstrap();
