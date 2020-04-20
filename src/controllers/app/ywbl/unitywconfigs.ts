import {getManager, getRepository, getConnection} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Unitywconfigs} from '../../../entity/Unitywconfigs'
import * as tool from '../../../utils/tools/tool1'

let route = new CRobj();

 //获取所有业务配置授权
 route.get('/app/ywbl/unitywconfigs/getunitywconfigs', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        ret.data = await getManager().getRepository(Unitywconfigs).createQueryBuilder().select().orderBy("bid,step").getMany()
        ctx.response.body = ret
    } catch (e) {

        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

  //保存
  route.post('/app/ywbl/unitywconfigs/saveunitywconfigs', async (ctx, next) => {
    let myRunner = getManager().connection.createQueryRunner()
    await  myRunner.startTransaction()
    try {
        const params = ctx.request.body;
        const ret = new  IChttp.CRet(1);
        let confs = params.confs
        let t = myRunner.manager.getRepository(Unitywconfigs)
        for(let c of confs) {
            let {id,step} = c
            if (id) {
                let r = await t.findOne({
                    id: id
                })
                Object.assign(r, c)

                await myRunner.manager.save(r)
            } else {
                let o = tool.objcopybynew<Unitywconfigs>(Unitywconfigs, c)
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