import {getManager, getRepository} from "typeorm";
import { Unitywconfigs } from "../../../entity/Unitywconfigs"
import { Sysuser } from "../../../entity/Sysuser"

//获取某单位某一业务某一步的操作人
export async function getoper (dwid, bid, step) {
    try {
        let t = getManager().getRepository(Unitywconfigs)
        let r = await t.findOne({
            dwid: dwid,
            bid: bid,
            step: step
        })
        const where = ` JSON_CONTAINS('[${r.runids}]',JSON_ARRAY(id))`;
        let query = getRepository(Sysuser).createQueryBuilder().where(where).select()
        return await query.getMany()
    } catch (e) {
        throw e
    }
}