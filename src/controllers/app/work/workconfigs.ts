import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Workconfigs} from '../../../entity/Workconfigs'

let route = new CRobj();

 //获取所有业务配置
 route.get('/app/ywbl/work/workconfigs/get', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let where = ``
        ret.data = await getRepository(Workconfigs).createQueryBuilder().select().orderBy("wid").getMany()
        ctx.response.body = ret
    } catch (e) {

        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

 export {route}