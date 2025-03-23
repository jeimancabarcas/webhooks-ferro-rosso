import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Post,
  Query,
} from '@nestjs/common';

@Controller('whatsapp/webhook')
export class WhatsappController {
  private readonly VERIFY_TOKEN = 'MI_TOKEN_SEGURO';
  private readonly logger = new Logger(WhatsappController.name);

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') token: string,
  ): string {
    this.logger.log(
      `🔹 Recibido GET para verificar: mode=${mode}, token=${token}`,
    );

    if (mode === 'subscribe' && token === this.VERIFY_TOKEN) {
      this.logger.log('✅ Webhook verificado correctamente');
      return challenge; // WhatsApp espera esto para aprobar el webhook
    }

    this.logger.warn('⚠️ Token inválido, rechazando la verificación');
    throw BadRequestException('Token Invalido')
  }
  

  @Post()
  receiveMessage(@Body() body: any, @Headers() headers: any) {
    this.logger.log('📩 Mensaje recibido:');
    this.logger.log(JSON.stringify(body, null, 2));

    return { status: 'OK' };
  }
}
