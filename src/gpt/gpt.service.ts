import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';
import { OrthographyDto } from './dtos';
import OpenAI from 'openai';

@Injectable()
export class GptService {

    private openAi = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    // Solo va a llamar casos de uso
    async orthographyCeck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase( this.openAi, {
            prompt: orthographyDto.prompt
        });
    }
}
