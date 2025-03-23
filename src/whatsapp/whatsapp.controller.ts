import {
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


  // ✅ Verificación de Webhook
  @Get()
  verifyWebhook(@Query() query: any): string {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    this.logger.log(`🔹 Recibido GET para verificar: mode=${mode}, token=${token}`);

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      this.logger.log('✅ Webhook verificado correctamente');
      return challenge; // WhatsApp espera esto para aprobar el webhook
    }

    this.logger.warn('⚠️ Token inválido, rechazando la verificación');
    return 'Token inválido';
  }

  // ✅ Recibir mensajes de WhatsApp
  @Post()
  receiveMessage(@Body() body: any, @Headers() headers: any) {
    this.logger.log('📩 Mensaje recibido:');
    this.logger.log(JSON.stringify(body, null, 2));

    return { status: 'OK' };
  }
}
