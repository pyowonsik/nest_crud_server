import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name: string;
    
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    price?: number;
  
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    stock?: number;
}
