import {getManager, getRepository} from "typeorm";
import * as mycrypto from '../../../../utils/tools/mycrypto'
import * as IChttp from '../../../../types/IChttp'
import {CRobj} from '../../../manage/baseClass'
import {Sysuser} from '../../../../entity/Sysuser'
import {Unit} from '../../../../entity/Unit'
import * as tool from '../../../../utils/tools/tool1'
let route = new CRobj();
route.get('/web/sysmanage/qxgl/user/getusers', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let query = getRepository(Sysuser)
                    .createQueryBuilder()
                    .select()
                    //.addSelect('count')
                    .where(params.where)
        let u = await query.limit(params.size)
                        .offset((params.currentPage - 1) * params.size)
                        .getMany();
        let count = await query.getCount();
        ret.data = {
            users: u,
            total: count
        }
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

route.post('/web/sysmanage/qxgl/user/add', async (ctx, next) => {
    try {
        let data =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let u = tool.objcopybynew<Sysuser>(Sysuser, data)
        u.pwd = mycrypto.getsha256("888888")
        const table = getManager().getRepository(Unit);
        const row =  await  table.findOne({
            id: u.dwid
        })
        u.dwmc = row.dwmc;
        u.dwbm = row.dwbm
        ret.data = await getManager().save(u);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

export {route}