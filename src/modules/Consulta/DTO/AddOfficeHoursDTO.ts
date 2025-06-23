import { IsOptional, IsString, Length} from "class-validator";

class OfficeHoursDTO {
    @IsString({
        message: 'Precisa do dia do expediente'
    })
    DtExpediente: Date = new Date();
    HrExpediente: string = '';
    StsAtivoExpedient: string = 's';
}

export default class addOfficeHoursDTO {

    expedientes: Array<OfficeHoursDTO> = []
}