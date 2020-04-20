import {getManager, getRepository} from "typeorm"
import { Unit } from "../../../../entity/Unit"

export async function getunitbyid (id) {
    try {
        let t = getManager().getRepository(Unit)
        let r = await t.findOne({
            id: id
        })
        return r
    } catch (e) {
        throw e
    }    
}