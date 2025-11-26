import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    await app.listen(3001);
    console.log('Application is running on: http://localhost:3001');
  } catch (error) {
    console.error('Error starting application:', error);
  }
}
bootstrap();
