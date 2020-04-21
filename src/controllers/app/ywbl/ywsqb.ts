 
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

 //获取一组车辆相关的的业务，包括各类业务，审核通过和不通过
 route.get('/app/ywbl/ywsqb/getywsbyvehids', async (ctx, next) => {
    try {
        const {vehids} = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let ids = JSON.parse(vehids)
        const where = ` JSON_CONTAINS(JSON_ARRAY(${ids}),JSON_ARRAY(vehid)) order by id`;
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

 route.post('/app/ywbl/ywsqb/addywbdelid', async (ctx, next) => {
    try {
        let {ywid, uid} =ctx.request.body
        const sql = `update ywsqb set delids= JSON_ARRAY_APPEND(delids,'$', ${uid}) where  id=${ywid}`
        await getManager().query(sql)
        const ret = new  IChttp.CRet(1);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })


 export {route}