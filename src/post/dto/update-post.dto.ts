import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdatePostDto {
    @IsNotEmpty()
    @IsOptional()
    title? : string;

    @IsNotEmpty()
    @IsOptional()
    content? : string;

    @IsNotEmpty()
    @IsOptional()
    @IsNumber()
    userId? : number;
}
