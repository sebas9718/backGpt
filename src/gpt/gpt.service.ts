import * as path from "path";
import * as fs from "fs";

import { Injectable, NotFoundException } from '@nestjs/common';
import { audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase, orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { AudioToTextDto, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from 'openai';
import { ImageGenerationDto } from './dtos/image-generation.dto';

@Injectable()
export class GptService {

    private openAi = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    // Solo va a llamar casos de uso
    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase( this.openAi, {
            prompt: orthographyDto.prompt
        });
    }

    async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserUseCase( this.openAi, { prompt });
    }

    async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserStreamUseCase( this.openAi, { prompt });
    }

    async translate({ prompt, lang }: TranslateDto) {
        return await translateUseCase( this.openAi, { prompt, lang });
    }

    async textToAudio({ prompt, voice }: TextToAudioDto) {
        return await textToAudioUseCase( this.openAi, { prompt, voice });
    }

    async textToAudioGetter( fileId: string ) {
        const filePath = path.resolve( __dirname, '../../generated/audios', `${fileId}.mp3`);
        const wasFound = fs.existsSync(filePath);

        if( !wasFound ) throw new NotFoundException(`File ${ fileId } not found`);

        return filePath;
    }

    async audioToText( audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto ) {
        const { prompt } = audioToTextDto;
        return await audioToTextUseCase( this.openAi, { audioFile, prompt });
    }

    async imageGeneration( imageGenerationDto: ImageGenerationDto ) {
        return await imageGenerationUseCase( this.openAi, {...imageGenerationDto} )
    }

    async getGeneratedImage( fileNameImage: string ) {
        const filePath = path.resolve('./', './generated/images/', fileNameImage);
        const wasFound = fs.existsSync(filePath);

        if( !wasFound ) throw new NotFoundException(`File ${ fileNameImage } not found`);

        return filePath;
    }

    async generatedImageVariation( { baseImage }: ImageVariationDto ) {
        return await imageVariationUseCase( this.openAi, { baseImage} )
    }
}
