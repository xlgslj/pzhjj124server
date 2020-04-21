import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Ywsqb} from '../../../entity/Ywsqb'
import {YwUnit} from '../../../entity/YwUnit'
import {Tasks1} from '../../../entity/Tasks1'
import {Ywconfigs} from '../../../entity/Ywconfigs'
import {YwFlow} from '../../../entity/YwFlow'
let route = new CRobj();



  //获取业务流水
  route.get('/app/ywbl/ywflow/getflows', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let where = `ywid=${params.id} order by id`
        ret.data = await getRepository(YwFlow).createQueryBuilder().where(where).select().getMany()
        ctx.response.body = ret
    } catch (e) {

        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })


export {route}