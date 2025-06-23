export interface IOfficeHoursToAdd {
    IdUser: number
    DtExpediente: Date
    HrExpediente: string
    StsAtivoExpediente: string
}



export interface IOfficeHours {
    DtExpediente: Date
    HrExpediente: string
    StsAtivoExpediente: string
}

export interface IOfficeHoursToAddService {
    IdUser: number
    OfficeHours: Array<IOfficeHours>
}
