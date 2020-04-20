import {getManager, getRepository} from "typeorm";
import { Ywsqb } from "../../../entity/Ywsqb"
import { YwFlow } from "../../../entity/YwFlow"
import { Ywconfigs } from "../../../entity/Ywconfigs"
import { Tasks1 } from "../../../entity/Tasks1"
import { Messages } from "../../../entity/Messages"
import * as tool from '../../../utils/tools/tool1'
import * as msgsrv from '../messages/_pub'

export async function addtask1 (obj) {
    try {
        let o = tool.objcopybynew<Tasks1>(Tasks1,obj)
        return await getManager().save(o);
    } catch (e) {
        throw e
    }
}


export async function addyw_flow (obj) {
    try {
        let o = tool.objcopybynew<YwFlow>(YwFlow,obj)
        await getManager().save(o);
    } catch (e) {
        throw e
    }

}

export async function getsteps (bid) {
    try {
        const where = `bid=${bid} order by step`;
        const m = await getRepository(Ywconfigs).createQueryBuilder().select().where(where).getMany();
        return m
    } catch (e) {
        throw e
    }    
}

//根据tid 查对应消息
export async function getmsgbytid (tid) {
    try {
        const where = `JSON_CONTAINS(initdata,'${tid}', '$.tid')`;
        const m = await getManager(). getRepository(Messages).createQueryBuilder().select().where(where).getOne()
        return m
    } catch (e) {
        throw e
    }    
}