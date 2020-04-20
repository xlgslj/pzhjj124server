interface IRet {
    status: number
    msg?: string
    data?: any
    err?: any
}

export class CRet implements IRet {
    status: number
    msg?: string
    data?: any
    err?: any 
    constructor(status: number, other?:string) {
        this.status = status
        if (other&&status) this[other] = null   
        if (!status) console.log(other)   
    }
}