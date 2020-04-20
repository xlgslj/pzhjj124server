import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Ywconfigs} from '../../../entity/Ywconfigs'

let route = new CRobj();

 //获取所有业务配置
 route.get('/app/ywbl/ywconfigs/getywconfigs', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let where = ``
        ret.data = await getRepository(Ywconfigs).createQueryBuilder().select().orderBy("bid,step").getMany()
        ctx.response.body = ret
    } catch (e) {

        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })
/*
 //获取单个业务配置记录
 route.get('/app/ywbl/ywconfigs/getywconfig', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let where = `bid=${params.id} order by step`
        ret.data = await getRepository(Ywconfigs).createQueryBuilder().where(where).select().getMany()
        ctx.response.body = ret
    } catch (e) {

        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })*/

 export {route}