import {getManager, getRepository} from "typeorm";
import { Messages } from "../../../entity/Messages"
import * as tool from '../../../utils/tools/tool1'
import * as wxservice from '../../../service/wxservice'
import {WxSubscribe} from './_WxSubscribe'
import {Subscribe} from '../../../entity/Subscribe'
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

export  function sendsubmsg(msgs: WxSubscribe[]) {
    msgs.forEach(async d => {
        let res = await wxservice.sendsubmsg(d)
        let s = new Subscribe()
        s.touser = d.tousername
        s.title = d.data.thing1.value
        s.connect = d
        s.sj = new Date()
        s.result = <Object>res
        getManager().save(s)
        console.log(res)
    });
}