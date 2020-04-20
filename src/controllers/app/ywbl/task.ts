import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Ywsqb} from '../../../entity/Ywsqb'
import {Tasks1} from '../../../entity/Tasks1'
let route = new CRobj();

//获取发给自己且未完成的任务
route.get('/app/ywbl/task/getmycanruntasks', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        const where = ` JSON_CONTAINS(tasks1.toids,JSON_ARRAY(${params.userid})) and tasks1.zt=1 order by tasks1.id`;
        let query = getManager().createQueryBuilder(Tasks1,'tasks1').leftJoinAndMapOne('tasks1.ywsqb',Ywsqb,'sqb', 'tasks1.ywid = sqb.id').where(where)
        let tasks = await query.getMany()
        ret.data = tasks
        ctx.response.body = ret
    } catch (e) {

        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

//获取发给自己且未完成的任务
route.get('/app/ywbl/task/gettaskbyywid', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        const where = `ywid=${params.ywid}`;
        let query = getManager().createQueryBuilder(Tasks1, 'task1').where(where).orderBy('task1.id')
        let tasks = await query.getMany()
        ret.data = tasks
        ctx.response.body = ret
    } catch (e) {

        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })


//获取单个任务
 route.get('/app/ywbl/task/getonetask1', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let t = getManager().getRepository(Tasks1)
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