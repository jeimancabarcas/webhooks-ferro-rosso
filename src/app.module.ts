import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappController } from './whatsapp/whatsapp.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { DeepseekModule } from './deepseek/deepseek.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'forno_rosso_db',
      synchronize: true,
      autoLoadEntities: true,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DeepseekModule,
    OrdersModule,
  ],
  controllers: [AppController, WhatsappController],
  providers: [AppService, WhatsappService],
})
export class AppModule {}
