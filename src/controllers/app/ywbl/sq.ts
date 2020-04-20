import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Ywsqb} from '../../../entity/Ywsqb'
import * as pub from './_pub'
import * as sysmanager from '../sysmanage/_pub'
import * as message from '../messages/_pub'
import * as unitsrv from '../sysmanage/qxgl/_unit'
import * as tool from '../../../utils/tools/tool1'
let route = new CRobj();


 route.post('/app/ywbl/sq', async (ctx, next) => {
    try {
        let data =ctx.request.body
        let gdw = await unitsrv.getunitbyid(data.ywsqb.gid)
        let stepnamefield = gdw.iszsdw === 1 ? 'name1' : 'name0'
        const ret = new  IChttp.CRet(1);
        let o = tool.objcopybynew<Ywsqb>(Ywsqb, data.ywsqb)
        o.kssj = new Date()
        o.gdwiszsdw = gdw.iszsdw
        let ywb = await getManager().save(o);
        let {id:ywid, bid, dwid, gid, sqrid, sqr} = ywb

        let steps = await pub.getsteps(bid)
        let tousers = await sysmanager.getusersbyzw(gid, '03')
        //添加任务
        let task = await pub.addtask1({
            bid: bid,
            ywid: ywid,
            step: 2,
            stepname: steps[2][stepnamefield],
            dwid: dwid,
            fromid: sqrid,
            fromname: sqr,
            toids: tousers.map(d => d.id),
            tonames: tousers.map(d => d.name),
            kssj: new Date(),
            url0: steps[2].url0,
            url1: steps[2].url1,
            zt: 1          
        }) 


        await pub.addyw_flow({
            bid: bid,            
            ywid: ywid,   
            dwid: dwid, 
            dwmc: await sysmanager.getdwmc(dwid),
            userid: sqrid,
            username: sqr, 
            sj: new Date(),
            step: 1,
            stepname: steps[1][stepnamefield],
            zt: 1       
        })

        await pub.addyw_flow({
            tid: task.id,
            bid: bid,              
            ywid: ywid,   
            dwid: gid, 
            dwmc: await sysmanager.getdwmc(gid),            
            step: 2,
            stepname: steps[2][stepnamefield],
            zt: 0       
        })
        //创建消息
        let msg = {
            type: '业务办理',
            gid: 9000002,
            avatarurl:'https://api.pzhsykj.com:8443/images/my/bmfw.jpg',
            name: `${steps[2].bname}-${steps[2][stepnamefield]}`,
            fromid: sqrid,
            fromname: sqr,
            toids: tousers.map(d => d.id),
            tonames:  tousers.map(d => d.name),
            path: steps[2].url1,
            initdata: {ywid: ywid, tid: task.id, bid: bid},
            kssj: new Date(),
            showids: [],
            delids: [],
            zt: '未完成'
          }        
        await message.addmsg(msg)
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })
 
 export {route}