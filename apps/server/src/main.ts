import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription('API for managing tasks with filtering and sorting')
    .setVersion('1.0')
    .addTag('tasks', 'Task management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 8000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 8000}`);
  console.log(`Swagger UI is available at: http://localhost:${process.env.PORT ?? 8000}/api`);
}
bootstrap();
