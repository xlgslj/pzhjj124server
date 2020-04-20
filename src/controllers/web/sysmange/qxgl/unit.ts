import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../../types/IChttp'
import {CRobj} from '../../../manage/baseClass'
import {Unit} from '../../../../entity/Unit'
import * as tool from '../../../../utils/tools/tool1'
let route = new CRobj();


route.get('/web/sysmanage/qxgl/unit/getunits', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let query = getRepository(Unit)
                    .createQueryBuilder()
                    .select()
                    //.addSelect('count')
                    //.where('')
        let u = await query.limit(params.size)
                        .offset((params.currentPage - 1) * params.size)
                        .getMany();
        let count = await query.getCount();
        ret.data = {
            units: u,
            total: count
        }
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })
/**
 * {
  key: '0',
  label: '全部',
  tiemstamp: '1584150069902'
}
 */
route.get('/web/sysmanage/qxgl/unit/unitstree', async (ctx, next) => {
    try {
        const ret = new  IChttp.CRet(1);
        const tables = getManager().getRepository(Unit);
        let u = await tables.find();
        let root = {
            key: parseInt(ctx.request.query.key),
            label: ctx.request.query.label
        }
        const tree = tool.getTree(u, 0, 'id', 'dwmc')
        tree.length ? root["children"] = tree : null
        ret.data = [root]
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

route.post('/web/sysmanage/qxgl/unit/add', async (ctx, next) => {
    try {
        let data =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let u = tool.objcopybynew<Unit>(Unit, data)
        ret.data = await getManager().save(u);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

export {route}