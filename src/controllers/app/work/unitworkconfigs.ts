import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Unitworkconfigs} from '../../../entity/Unitworkconfigs'
import * as tool from '../../../utils/tools/tool1'

let route = new CRobj();

 //获取所有业务配置
 route.get('/app/ywbl/work/unitworkconfigs/getall', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let where = ``
        ret.data = await getRepository(Unitworkconfigs).createQueryBuilder().select().orderBy("id").getMany()
        ctx.response.body = ret
    } catch (e) {

        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

   //保存
   route.post('/app/ywbl/unitworkconfigs/saveunitworkconfigs', async (ctx, next) => {
    let myRunner = getManager().connection.createQueryRunner()
    await  myRunner.startTransaction()
    try {
        const params = ctx.request.body;
        const ret = new  IChttp.CRet(1);
        let confs = params.confs
        let t = myRunner.manager.getRepository(Unitworkconfigs)
        for(let c of confs) {
            let {id} = c
            if (id) {
                let r = await t.findOne({
                    id: id
                })
                Object.assign(r, c)

                await myRunner.manager.save(r)
            } else {
                let o = tool.objcopybynew<Unitworkconfigs>(Unitworkconfigs, c)
                o.wname = c.name
                await myRunner.manager.save(o)
            }
        }
        await myRunner.commitTransaction()
        await myRunner.release()
        ctx.response.body = ret
    } catch (e) {
        await myRunner.rollbackTransaction()
        await myRunner.release()
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

 export {route}