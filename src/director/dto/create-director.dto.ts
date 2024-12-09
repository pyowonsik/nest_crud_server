import { IsDateString, IsNotEmpty } from "class-validator";
import { BaseTable } from "src/common/base-table.entity";

export class CreateDirectorDto extends BaseTable {
    
    @IsNotEmpty()
    name : string;

    @IsNotEmpty()
    @IsDateString()
    dob : Date;

    @IsNotEmpty()
    nationality : string;
}
