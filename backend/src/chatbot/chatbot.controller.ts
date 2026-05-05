import { Body, Controller, Post } from '@nestjs/common';
import type { ChatbotRequest } from './chatbot.service';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('respond')
  respond(@Body() body: ChatbotRequest) {
    return this.chatbotService.respond(body);
  }
}
