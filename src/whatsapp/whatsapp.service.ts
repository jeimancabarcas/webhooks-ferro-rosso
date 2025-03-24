import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async sendWhatsAppMessage(messageSender, message) {
    this.logger.log(`Sending whatsapp message to: ${messageSender}`);
    this.logger.log(`Message: ${message}`);
    try {
      const url: string = `https://graph.facebook.com/${this.configService.get<string>('API_VERSION')}/${this.configService.get<string>('ID_WHATSAPP_BUSSINESS_NUMBER')}/messages`;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.configService.get<string>('WHATSAPP_API_ACCESS_TOKEN')}`,
        },
      };
      const data: string = JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: messageSender,
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      });
      await lastValueFrom(this.httpService.post(url, data, config));
      this.logger.log(`Message sent succeessfully`);
    } catch {
      this.logger.error(`Error sending whatsapp message`);
    }
  }
}
