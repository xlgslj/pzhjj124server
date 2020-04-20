import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Drv} from '../../../entity/Drv'
import {Veh} from '../../../entity/Veh'
import { UnitVehDrv } from "../../../entity/UnitVehDrv"
import * as tool from '../../../utils/tools/tool1'
import { Sysuser } from "../../../entity/Sysuser";
import * as sysvar from '../../../config/sysvar'
let route = new CRobj();

//通过unitvehdrv关系表获取单位的驾驶人
route.get('/app/drv/basic/getdrvs', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const unitids = JSON.parse(params.units)
        const ret = new  IChttp.CRet(1);
        const where = `JSON_CONTAINS(JSON_ARRAY(${unitids}),JSON_ARRAY(unitvehdrv.dwid))`;
        let query = getManager()
        .createQueryBuilder(UnitVehDrv,'unitvehdrv')
        .leftJoinAndMapOne('unitvehdrv.drv',Drv,'drv', 'unitvehdrv.drvid = drv.id')
        .where(where)
        .select("unitvehdrv.dwid, unitvehdrv.drvid, drv.*")
        .addSelect("count(1) as vehs")
        .groupBy("unitvehdrv.dwid, unitvehdrv.drvid")
         let drvs = await query.getRawMany()
        ret.data = drvs
        ctx.response.body = ret
    } catch (e) {
        console.log(e)
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })
//通过unitvehdrv关系表获取车辆的驾驶人
route.get('/app/drv/basic/getdrvsbyvehid', async (ctx, next) => {
    try {
        const {vehid} = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        const where = `vehid=${vehid}`;
        let query = getManager()
        .createQueryBuilder(UnitVehDrv,'unitvehdrv')
        .leftJoinAndMapOne('unitvehdrv.drv',Drv,'drv', 'unitvehdrv.drvid = drv.id')
        .where(where)
         let drvs = await query.getMany()
        ret.data = drvs
        ctx.response.body = ret
    } catch (e) {
        console.log(e)
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })


 route.get('/app/drv/basic/getdrv', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        let table = getManager().getRepository(Drv)
        let r = await table.findOne({
            id: params.id
        })
        if (!r) throw "没有该驾驶人"
        const where = `unitvehdrv.dwid=${params.dwid} and unitvehdrv.drvid=${params.id} order by unitvehdrv.id`;
        let query = getManager().createQueryBuilder(UnitVehDrv,'unitvehdrv').leftJoinAndMapOne('unitvehdrv.veh',Veh,'veh', 'unitvehdrv.vehid = veh.id').where(where)
        let vehs = await query.getMany()
        const ret = new  IChttp.CRet(1);
        ret.data = {
            drv: r,
            glcl: vehs
        }
        ctx.response.body = ret
    } catch (e) {
        console.log(e)
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

 route.post('/app/drv/basic/add', async (ctx, next) => {
    try {
        let data =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let u = tool.objcopybynew<Drv>(Drv, data.drv)
        let drv= await getManager().save(u);
        for (let vehid of data.drv.glcl) {
            let uvd = new UnitVehDrv()
            uvd.dwid = data.dwid
            uvd.vehid = vehid
            uvd.drvid = drv.id
            await getManager().save(uvd)
        }
        //将驾驶员添加为系统用户
        let t = getManager().getRepository(Sysuser)
        let r
        r = await t.findOne({
            sfzmhm: drv.sfzmhm
        })
        if (r) {
            r.drvid = drv.id
        } else {
            r = new Sysuser()
            r.isadmin = 0
            r.type = 'A'
            r.uid = drv.sfzmhm
            r.name = drv.xm
            r.sfzmhm = drv.sfzmhm
            r.sjhm = drv.sjhm
            r.dwid = data.drv.dwid
            r.dwmc = data.drv.dwmc
            r.zw = data.drv.zw
            r.qxlx = '角色权限'
            r.qxs = sysvar.drvroles
            r.drvid = drv.id
            r.createlx = '驾驶人管理'
        }
        await getManager().save(r)
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

 
 route.post('/app/drv/basic/del', async (ctx, next) => {
    try {
        let data =ctx.request.body
        let t = getManager().getRepository(Drv)
        let r = await t.findOne({
            id: data.id
        })
        await getManager().remove(r)
        const ret = new  IChttp.CRet(1);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

 route.post('/app/drv/basic/update', async (ctx, next) => {
    let myRunner = getManager().connection.createQueryRunner()
    await  myRunner.startTransaction()
    try {
        let {drv} =ctx.request.body
        const ret = new  IChttp.CRet(1);
        //修改驾驶人
        let drvt = myRunner.manager.getRepository(Drv)
        let rt = await drvt.findOne({
            id: drv.id
        })
        Object.assign(rt, drv)
        await myRunner.manager.save(rt)

        //修改系统用户
        let st = myRunner.manager.getRepository(Sysuser)
        let rs = await st.findOne({
            drvid: drv.id
        })
        if (rs) {
            rs.name = drv.xm
            rs.sfzmhm = drv.sfzmhm
            rs.sjhm = drv.sjhm
            myRunner.manager.save(rs)
        }

        //删除原来的unit_veh_drv关系
        let uvdt = myRunner.manager.getRepository(UnitVehDrv) 
        let uvdtrs = await uvdt.find({
            dwid: drv.dwid,
            drvid: drv.id,
        })

        for (let r of uvdtrs) {
            await myRunner.manager.remove(r)
        }

        //新增unit_veh_drv关系

        for (let vehid of drv.glcl) {
            let uvd = new UnitVehDrv()
            uvd.dwid = drv.dwid
            uvd.vehid = vehid
            uvd.drvid = drv.id
            await myRunner.manager.save(uvd)
        }

        await myRunner.commitTransaction()
        await myRunner.release()
        ctx.response.body = ret
    } catch (e) {
        await myRunner.rollbackTransaction()
        await myRunner.release()
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })


 export {route}