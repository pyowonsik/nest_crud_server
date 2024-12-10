import { IsArray, IsNotEmpty } from "class-validator";

export class CreateMovieDto{
    @IsNotEmpty()
    title : string;

    @IsNotEmpty()
    @IsArray()
    genres : number[];

    @IsNotEmpty()
    detail : string;

    @IsNotEmpty()
    directorId : number;
}


