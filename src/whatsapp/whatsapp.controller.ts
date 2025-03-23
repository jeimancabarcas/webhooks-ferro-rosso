import { Body, Controller, Headers, Post } from '@nestjs/common';

@Controller('whatsapp/webhook')
export class WhatsappController {
  @Post()
  receiveMessage(@Body() body: any, @Headers() headers: any) {
    console.log('Mensaje recibido:', JSON.stringify(body, null, 2));
    return { status: 'OK' };
  }
}
