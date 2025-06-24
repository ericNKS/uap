import { IsArray, ArrayMinSize, ValidateNested, IsString, IsNumber, IsDateString } from "class-validator";
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
    @IsNumber()
    IdPaciente: number = 0;

    @IsNumber()
    IdEspecialista: number = 0;

    @IsDateString()
    DtConsulta: Date = new Date();
    
    @IsNumber()
    DiaSemanaConsulta: number = 0;

    @IsString()
    HrConsulta: number = 0;

    @IsString()
    InfoConsulta: number = 0;
}