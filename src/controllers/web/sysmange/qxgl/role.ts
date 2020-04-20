import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../../types/IChttp'
import {CRobj} from '../../../manage/baseClass'
import {Role} from '../../../../entity/Role'
import * as tool from '../../../../utils/tools/tool1'
let route = new CRobj();

route.get('/web/sysmanage/qxgl/role/getmyroles', async (ctx, next) => {
    try {
        let data =ctx.request.query
        const ret = new  IChttp.CRet(1);
        const table = getManager().getRepository(Role)
        ret.data = await table.find({
            uid: data.uid
        })
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

route.post('/web/sysmanage/qxgl/role/add', async (ctx, next) => {
    try {
        let data =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let r = tool.objcopybynew<Role>(Role, data)
        ret.data = await getManager().save(r);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

export {route}