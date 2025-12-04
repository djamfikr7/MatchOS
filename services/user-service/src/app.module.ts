import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { WalletModule } from './wallet/wallet.module';
import { PrivacyInterceptor } from './common/privacy.interceptor';

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
      entities: [User],
      synchronize: true,
      dropSchema: false,
    }),
    UsersModule,
    AuthModule,
    EventsModule,
    WalletModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: PrivacyInterceptor,
    },
  ],
})
export class AppModule { }

