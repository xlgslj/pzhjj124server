 
 import {getManager, getRepository} from "typeorm";
 import * as IChttp from '../../../types/IChttp'
 import {CRobj} from '../../manage/baseClass'
 import {Ywsqb} from '../../../entity/Ywsqb'
 let route = new CRobj();
 //获取自己参与过的业务
 route.get('/app/ywbl/ywsqb/getmyruns', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        const where = ` JSON_CONTAINS(runids,JSON_ARRAY(${params.userid})) order by id`;
        let query = getRepository(Ywsqb).createQueryBuilder().where(where).select()
        let yws = await query.getMany()
        ret.data = yws
        ctx.response.body = ret
    } catch (e) {

        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

  //获取单位所有业务
route.get('/app/ywbl/ywsqb/getunityws', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let t = getManager().getRepository(Ywsqb)
        ret.data = await t.find({
            dwid: params.dwid
        })
        ctx.response.body = ret
    } catch (e) {

        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

 
 //获取单个业务
 route.get('/app/ywbl/ywsqb/getyw', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let t = getManager().getRepository(Ywsqb)
        ret.data = await t.findOne({
            id: params.id
        })
        ctx.response.body = ret
    } catch (e) {

        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

 export {route}