import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Messages} from '../../../entity/Messages'
import {Menus} from '../../../entity/Menus'
import * as tool from '../../../utils/tools/tool1'
import * as wss from '../../../wssserver'
let route = new CRobj();

route.get('/web/task/task/getusertasks', async (ctx, next) => {
    try {
        let params =ctx.request.query
        const ret = new  IChttp.CRet(1);
        const where = `JSON_CONTAINS(JSON_ARRAY(toids),JSON_ARRAY(${params.id}))`;
        let r = await getRepository(Messages)
                        .createQueryBuilder()
                        .select().where(where).getMany();
        ret.data = r
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

route.post('/web/task/task/create', async (ctx, next) => {
    try {
        let data =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let t = tool.objcopybynew<Messages>(Messages, data)
        t.kssj = new Date();
        ret.data = await getManager().save(t);
        wss.sendtobyuid(<number[]>t.toids, {event:'newtask', task: t})
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

export {route}