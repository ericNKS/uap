export interface IOfficeHoursToAdd {
    idUser: number
    dtExpediente: Date
    hrExpediente: string
    stsAtivoExpediente: string
}



export interface IOfficeHours {
    dtExpediente: Date
    hrExpediente: string
    stsAtivoExpediente: string
}

export interface IOfficeHoursToAddService {
    idUser: number
    officeHours: Array<IOfficeHours>
}
