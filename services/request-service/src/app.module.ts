import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestsModule } from './requests/requests.module';
import { Request } from './requests/entities/request.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'matchos',
      password: 'devpass',
      database: 'matchos_db',
      entities: [Request],
      synchronize: true,
    }),
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
