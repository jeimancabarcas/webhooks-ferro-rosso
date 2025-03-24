import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { lastValueFrom } from 'rxjs';

@Controller('whatsapp/webhooks')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') token: string,
  ): string {
    this.logger.log(
      `🔹 Recibido GET para verificar: mode=${mode}, token=${token}`,
    );

    if (
      mode === 'subscribe' &&
      token === this.configService.get<string>('VERIFY_TOKEN')
    ) {
      this.logger.log('✅ Webhook verificado correctamente');
      return challenge; // WhatsApp espera esto para aprobar el webhook
    }

    this.logger.warn('⚠️ Token inválido, rechazando la verificación');
    throw new BadRequestException('Token Invalido');
  }

  @Post()
  @HttpCode(200)
  receiveMessage(@Body() body: any) {
    const { messages } = body?.entry?.[0].changes?.[0].value ?? {};
    if (!messages) return;

    const message: any = messages[0];
    const messageSender = message.from;
    const messageID = message.id;

    switch (message.type) {
      case 'text': {
        const text: string = message.text.body;
        const url: string = `https://graph.facebook.com/${this.configService.get<string>('API_VERSION')}/${this.configService.get<string>('ID_WHATSAPP_BUSSINESS_NUMBER')}/messages`;

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.configService.get<string>('WHATSAPP_API_ACCESS_TOKEN')}`,
          },
        };

        this.generateAiResponse(text)
          .then((completion) => {
            console.log('Deepseek ok');
            const data: string = JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: messageSender,
              type: 'text',
              text: {
                preview_url: false,
                body: completion.choices[0].message.content,
              },
              context: {
                message_id: messageID,
              },
            });
            lastValueFrom(this.httpService.post(url, data, config))
              .then(() => console.log('graph ok'))
              .catch((err) => {
                console.log('Graph failed');
                console.error(err);
              });
          })
          .catch((err) => {
            console.log(err);
            console.log('Deepseek failed');
          });

        break;
      }
    }
    this.logger.log(
      `📩 Mensaje recibido: From: ${messageSender} - ${message.text.body}`,
    );

    return { status: 'OK' };
  }

  private async generateAiResponse(content: string) {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: this.configService.get<string>('DEEPSEEK_SECRET'),
    });
    return openai.chat.completions.create({
      messages: [{ role: 'system', content }],
      model: 'deepseek-chat',
    });
  }
}
