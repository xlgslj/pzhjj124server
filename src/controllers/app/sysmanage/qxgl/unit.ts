import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../../types/IChttp'
import {CRobj} from '../../../manage/baseClass'
import {Unit} from '../../../../entity/Unit'
import {Messages} from '../../../../entity/Messages'
import * as tool from '../../../../utils/tools/tool1'
let route = new CRobj();

route.get('/app/sysmanage/qxgl/unit/getunit', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let units = getRepository(Unit)
        let u = await units.findOne({
            id: params.id
        })
        
        ret.data = u
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

route.get('/app/sysmanage/qxgl/unit/getunits', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let query = getRepository(Unit)
                    .createQueryBuilder()
                    .select()
                    //.where('')
        let u = await query
                        .limit(params.size)
                        .offset(params.offset)
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

 route.post('/app/sysmanage/qxgl/unit/add', async (ctx, next) => {
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

 route.post('/app/sysmanage/qxgl/unit/del', async (ctx, next) => {
    try {
        let {id} =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let t = getManager().getRepository(Unit)
        let r = await t.findOne({
            id: id
        })
        await getManager().remove(r)
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

 route.post('/app/sysmanage/qxgl/unit/update', async (ctx, next) => {
    try {
        let {unit, sysuser} =ctx.request.body
        const tables = getManager().getRepository(Unit)
        let r = await tables.findOne({
            id: unit.id
        })
        Object.assign(r, {...unit})
        await getManager().save(r)

        //结束相关消息
        const where = `gid='9000001' and name='完善单位资料' and JSON_CONTAINS(initdata,'${unit.id}', '$.id')`;
        const msg = await getManager(). getRepository(Messages).createQueryBuilder().select().where(where).getOne()
        if (msg) {
            msg.runid = sysuser.id
            msg.runname = sysuser.name
            msg.jssj = new Date()
            msg.zt = "完成"
            await getManager().save(msg)
        }

        const ret = new  IChttp.CRet(1);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

export {route}