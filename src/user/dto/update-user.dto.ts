import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    email? : string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    password? : string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    profileImage? : string;
}
