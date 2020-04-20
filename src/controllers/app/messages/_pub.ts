import {getManager, getRepository} from "typeorm";
import { Messages } from "../../../entity/Messages"
import * as tool from '../../../utils/tools/tool1'

export async function addmsg (obj) {
    try {
        let o = tool.objcopybynew<Messages>(Messages, obj)
        await getManager().save(o);
    } catch (e) {
        throw e
    }    
}

export async function updatemsg (id,obj) {
    try {
        let t = getManager().getRepository(Messages)
        let r = await t.findOne({
            id: id
        })
        Object.assign(r, obj)
        await getManager().save(r)
    } catch (e) {
        throw e
    }    
}