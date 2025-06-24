import { IsString, IsNumber, IsDateString } from "class-validator";

export default class AddConsultaDTO {
    @IsNumber()
    IdEspecialista: number = 0;

    @IsDateString()
    DtConsulta: Date = new Date();
    
    @IsNumber()
    DiaSemanaConsulta: number = 0;

    @IsString()
    HrConsulta: string = '';

    @IsString()
    InfoConsulta: string = '';
}