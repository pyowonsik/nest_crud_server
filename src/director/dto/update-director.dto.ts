import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseTable } from 'src/common/base-table.entity';

export class UpdateDirectorDto extends BaseTable {
    @IsNotEmpty()
    @IsOptional()
    name : string;

    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    dob : Date;

    @IsNotEmpty()
    @IsOptional()
    nationality : string;
}
