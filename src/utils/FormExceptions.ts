import { ValidationError } from "class-validator";

interface formExceptions {
    items: Array<string>,
    message: Array<Object>
}

export default function FormExceptions(err: Array<ValidationError>): formExceptions | null {
    if(err.length < 1){
        return null
    }
    
    const erros: formExceptions = {
        items: [],
        message: []
    }

    err.forEach(e => {
        erros.items.push(e.property)
        e.children?.forEach(j => {
            if(j.constraints){
                erros.message.push(j.constraints)
            }
        })
        if(e.constraints){
            erros.message.push(e.constraints)
        }
    })

    return erros
}