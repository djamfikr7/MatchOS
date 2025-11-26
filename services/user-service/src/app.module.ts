import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5433,
      username: process.env.POSTGRES_USER || 'matchos',
      password: process.env.POSTGRES_PASSWORD || 'devpass',
      database: process.env.POSTGRES_DB || 'matchos_db',
      entities: [User],
      synchronize: true,
      dropSchema: true, // Wipe and recreate schema to fix enum conflicts
    }),
    UsersModule,
    AuthModule,
    EventsModule,
  ],
})
export class AppModule { }
