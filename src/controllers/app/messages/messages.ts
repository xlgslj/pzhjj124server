import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Messages} from '../../../entity/Messages'
import * as tool from '../../../utils/tools/tool1'
let route = new CRobj();

route.get('/app/message/message/getmyall', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const uid = params.uid

        const where = `JSON_CONTAINS(toids,JSON_ARRAY(${uid})) and not JSON_CONTAINS(delids,JSON_ARRAY(${uid}))`;
        const m = await getRepository(Messages).createQueryBuilder().select().where(where).getMany();

        const ret = new  IChttp.CRet(1);
         ret.data = m
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

 route.get('/app/message/message/getbygroup', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const uid = params.uid
        const gid = params.gid

        const where = `gid=${gid} and not JSON_CONTAINS(delids,JSON_ARRAY(${uid}))`;
        const m = await getRepository(Messages).createQueryBuilder().select().where(where).getMany();

        const ret = new  IChttp.CRet(1);
         ret.data = m
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

 route.post('/app/message/message/add', async (ctx, next) => {
    try {
        let data =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let u = tool.objcopybynew<Messages>(Messages, data)
        ret.data = await getManager().save(u);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

 //修改消息，通过sql语句及传入值
 /**
  * where = `JSON_CONTAINS(initdata,'${tid}', '$.tid')`;
*     msg ={      msg.runid = params.sysuser.id
            msg.runname = params.sysuser.name
            msg.jssj = new Date()
            msg.zt = "完成"
}
  */
 route.post('/app/message/message/updatebysql', async (ctx, next) => {
    try {
        let params =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let ms = await getManager(). getRepository(Messages).createQueryBuilder().select().where(params.where).getMany()
        for (let m of ms) {
            Object.assign(m,params.msg)
            await getManager().save(m)
        }
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

 route.post('/app/message/message/setreadflag', async (ctx, next) => {
    try {
        let {uid, gid} =ctx.request.body

        const sql = `update messages set showids= JSON_ARRAY_APPEND(showids,'$', ${uid}) where  gid=${gid}  and not JSON_CONTAINS(showids,JSON_ARRAY(${uid}))`;//
        await getManager().query(sql)
        const ret = new  IChttp.CRet(1);
        ctx.response.body = ret
    } catch (e) {
        console.log(e)
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

 
 route.post('/app/message/message/completetask', async (ctx, next) => {
    try {
        let params = ctx.request.body
        let {mid:id, runid, runname, memo} = params
        const tables = getManager().getRepository(Messages);
        let r = await tables.findOne({id: id });
        Object.assign(r, {...params})
        await getManager().save(r)
        const ret = new  IChttp.CRet(1);
        ctx.response.body = ret
    } catch (e) {
        console.log(e)
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

export {route}