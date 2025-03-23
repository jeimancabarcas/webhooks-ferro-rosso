import { Body, Controller, Get, Headers, Logger, Post, Query } from '@nestjs/common';

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
    if (mode === 'subscribe' && token === this.VERIFY_TOKEN) {
      return challenge; // WhatsApp espera recibir este valor si todo está bien
    }
    return 'Token inválido'; // Si el token no coincide, WhatsApp no validará el webhook
  }

  @Post()
  receiveMessage(@Body() body: any, @Headers() headers: any) {
    this.logger.log('🔹 Nueva petición recibida');
    this.logger.log(`🔹 Headers: ${JSON.stringify(headers, null, 2)}`);
    this.logger.log(`🔹 Body: ${JSON.stringify(body, null, 2)}`);
    console.warn('Mensaje recibido:', JSON.stringify(body, null, 2));
    return { status: 'OK' };
  }
}
