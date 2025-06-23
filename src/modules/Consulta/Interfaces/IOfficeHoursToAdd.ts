export interface IOfficeHoursToAdd {
    IdUser: number
    DtExpediente: Date
    HrInicioExpediente: string
    HrFinalExpediente: string
    StsAtivoExpediente: string
}



export interface IOfficeHours {
    DtExpediente: Date
    HrInicioExpediente: string
    HrFinalExpediente: string
    StsAtivoExpediente: string
}

export interface IOfficeHoursToAddService {
    IdUser: number
    OfficeHours: Array<IOfficeHours>
}
