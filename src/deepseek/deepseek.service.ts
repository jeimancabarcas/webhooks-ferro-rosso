import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class DeepseekService {
  private readonly logger = new Logger(DeepseekService.name);

  constructor(private configService: ConfigService) {}

  async generateAiResponse(content: string) {
    this.logger.log(`Generating AI Response`);
    try {
      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: this.configService.get<string>('DEEPSEEK_SECRET'),
      });
      const response = await openai.chat.completions.create({
        messages: [{ role: 'system', content }],
        model: 'deepseek-chat',
      });
      this.logger.log(
        `Response generated: ${response.choices[0].message.content}`,
      );
      return response.choices[0].message.content;
    } catch {
      this.logger.error('Deep seek failed');
    }
  }
}
