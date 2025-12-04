import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestsModule } from './requests/requests.module';
import { Request } from './requests/entities/request.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: !process.env.DATABASE_URL ? (process.env.POSTGRES_HOST || 'postgres') : undefined,
      port: !process.env.DATABASE_URL ? parseInt(process.env.POSTGRES_PORT || '5432') : undefined,
      username: !process.env.DATABASE_URL ? (process.env.POSTGRES_USER || 'matchos') : undefined,
      password: !process.env.DATABASE_URL ? (process.env.POSTGRES_PASSWORD || 'devpass') : undefined,
      database: !process.env.DATABASE_URL ? (process.env.POSTGRES_DB || 'matchos_db') : undefined,
      entities: [Request, Category],
      synchronize: true,
    }),
    RequestsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
