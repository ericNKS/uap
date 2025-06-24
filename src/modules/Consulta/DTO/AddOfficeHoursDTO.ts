import { IsArray, ArrayMinSize, ValidateNested, IsString, IsNumber } from "class-validator";
import { Type } from "class-transformer";

class OfficeHoursDTO {
    @IsNumber()
    DtExpediente: number = 0;

    @IsString()
    HrInicioExpediente: string = '';

    @IsString()
    HrFinalExpediente: string = '';
}

export default class addOfficeHoursDTO {
    @IsArray()
    @ArrayMinSize(1, {
        message: 'Precisa ter pelo menos um expediente'
    })
    @ValidateNested({ each: true })
    @Type(() => OfficeHoursDTO)
    expedientes: Array<OfficeHoursDTO> = [];
}