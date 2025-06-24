export interface IOfficeHoursToAdd {
    IdUser: number
    DtExpediente: number
    HrInicioExpediente: string
    HrFinalExpediente: string
}



export interface IOfficeHours {
    DtExpediente: number
    HrInicioExpediente: string
    HrFinalExpediente: string
}

export interface IOfficeHoursToAddService {
    IdUser: number
    OfficeHours: Array<IOfficeHours>
}
