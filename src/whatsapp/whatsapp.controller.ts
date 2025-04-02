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
import { WhatsappService } from './whatsapp.service';
import { DeepseekService } from 'src/deepseek/deepseek.service';

@Controller('webhooks')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);
  constructor(
    private whatsappService: WhatsappService,
    private deepSeekService: DeepseekService,
    private configService: ConfigService,
  ) {}

  @Get('whatsapp')
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

  @Post('whatsapp')
  @HttpCode(200)
  async handleIncomingWhatsappMessage(@Body() body: any) {
    const { messages } = body?.entry?.[0].changes?.[0].value ?? {};
    if (!messages) return;

    const message: any = messages[0];
    const messageSender = message.from;
    this.logger.log(
      `📩 Mensaje recibido: ${message.text.body} - From: ${messageSender}`,
    );
    //const messageID = message.id;

    switch (message.type) {
      case 'text': {
        const text: string = message.text.body;
        const aiResponse = await this.deepSeekService.generateAiResponse(text);
        await this.whatsappService.sendWhatsAppMessage(
          messageSender,
          aiResponse,
        );
        break;
      }
    }
  }
}
