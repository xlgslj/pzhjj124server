import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Veh} from '../../../entity/Veh'
import { UnitVeh } from "../../../entity/UnitVeh"
import * as tool from '../../../utils/tools/tool1'
let route = new CRobj();

//通过UnitVeh关系表获取单位的机动车
route.get('/app/veh/basic/getvehs', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const unitids = JSON.parse(params.units)
        const ret = new  IChttp.CRet(1);
        const where = `JSON_CONTAINS(JSON_ARRAY(${unitids}),JSON_ARRAY(unitveh.dwid)) order by unitveh.id`;
        let query = getManager().createQueryBuilder(UnitVeh,'unitveh').leftJoinAndMapOne('unitveh.veh',Veh,'veh', 'unitveh.vehid = veh.id').where(where)
        let vehs = await query.getManyAndCount()
        //let count = await query.getCount();
        ret.data = {
            vehs: vehs[0],
            total: vehs[1]
        }
        ctx.response.body = ret
    } catch (e) {
        console.log(e)
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

 route.get('/app/veh/basic/getveh', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        let table = getManager().getRepository(Veh)
        let r = await table.findOne({
            id: params.id
        })
        if (!r) throw "没有该机动车"
        const ret = new  IChttp.CRet(1);
        ret.data = r
        ctx.response.body = ret
    } catch (e) {
        console.log(e)
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

 route.post('/app/veh/basic/add', async (ctx, next) => {
    try {
        let data =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let u = tool.objcopybynew<Veh>(Veh, data.veh)
        let veh= await getManager().save(u);
        let uv = new UnitVeh()
        uv.dwid = data.dwid
        uv.vehid = veh.id
        await getManager().save(uv)
        
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })
 
 
 route.post('/app/veh/basic/del', async (ctx, next) => {
    try {
        let {id} =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let t = getManager().getRepository(Veh)
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
 
  
 route.post('/app/veh/basic/update', async (ctx, next) => {
    try {
        let {veh} =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let t = getManager().getRepository(Veh)
        let r = await t.findOne({
            id: veh.id
        })
        Object.assign(r, veh)
        await getManager().save(r)
        
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

 export {route}