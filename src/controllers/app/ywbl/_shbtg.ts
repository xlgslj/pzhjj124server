import {getManager, getRepository} from "typeorm";
import { Ywsqb } from "../../../entity/Ywsqb"
import { YwFlow } from "../../../entity/YwFlow"
import { Ywconfigs } from "../../../entity/Ywconfigs"
import { Tasks1 } from "../../../entity/Tasks1"
import * as tool from '../../../utils/tools/tool1'
import * as msgsrv from '../messages/_pub'
import * as unitsrv from '../sysmanage/qxgl/_unit'
import * as ywbl from './_pub'
import * as sysmanager from '../sysmanage/_pub'
import { Messages } from "../../../entity/Messages"
import * as unitywconfigs from './_unitywconfigs'
import {WxSubscribe, templates, data0} from '../messages/_WxSubscribe'
import * as dateutil from '../../../utils/tools/dateFormat'
import * as message from '../messages/_pub'

//审核通过路由
export async function shbtg1 (params) {
    try {
        //如果有和任务关联消息, 修改消息
        let msg = await ywbl.getmsgbytid(params.options.tid)
        if (msg) {
            msg.runid = params.sysuser.id
            msg.runname = params.sysuser.name
            msg.jssj = new Date()
            msg.zt = "完成"
            await getManager().save(msg)
        }

        let t1 = getManager().getRepository(Tasks1)
        let r1 = await t1.findOne({
            id: params.options.tid
        })
        if (!r1.zt) throw "当前流程已不能操作，可能是已被他人处理"
        if (r1.pid) {
            // 如果本身是子任务
            await shbtg12(r1, params)
        } else {
            //如果本身不是子任务
            await shbtg11(params)         
        }       
       
    } catch (e) {
        throw e
    }    
}


//审核不通过，不是子任务
export async function shbtg11 (params) {
    let myRunner = getManager().connection.createQueryRunner()
    await  myRunner.startTransaction()
    try {
        let steps = await ywbl.getsteps(params.options.bid)
        let idx = steps.findIndex(d => d.step === params.step)
        let v = steps.slice(idx ) 
        let steps1 = v.map((d,i) => {
            return i === 0 || i === (v.length - 1) ? d.step : (d.step * -1 ) // [2,-3,-4,-5,-6,-7,8]
        })
        
        //修改业务表
        let t = myRunner.manager.getRepository(Ywsqb)
        let r = await t.findOne({
            id: params.options.ywid
        })

        3
        let gdw = await unitsrv.getunitbyid(r.gid)
        let stepnamefield = gdw.iszsdw === 1 ? 'name1' : 'name0'

        r.runids = (<Array<Number>>r.runids).concat([params.sysuser.id])
        r.runnames =  (<Array<string>>r.runnames).concat([params.sysuser.name])
        r.jssj = new Date()
        r.step = steps[steps.length -1].step
        r.steps = (<Array<Number>>r.steps).concat(steps1)
        r.stepname = steps[steps.length -1][stepnamefield]
        r.zt = 4 
        await myRunner.manager.save(r)

        
        //修改任务表
        let t1 = myRunner.manager.getRepository(Tasks1)
        let r1 = await t1.findOne({
            id: params.options.tid
        })

        Object.assign(r1, params.task)
        r1.runid = params.sysuser.id
        r1.runname = params.sysuser.name
        r1.jssj = new Date()
        r1.zt = 0
        r1.hdbj = 4
        await myRunner.manager.save(r1)

        //修改流水表
        let t2 = myRunner.manager.getRepository(YwFlow)
        let r2 = await t2.findOne({
            tid: params.options.tid
        })
        r2.userid =  params.sysuser.id
        r2.username = params.sysuser.name
        r2.sj = new Date()
        r2.zt = 1   
        r2.memo1 = params.task.memo1
        r2.memo2 = params.task.memo2
        await myRunner.manager.save(r2)

        //增加一条办结流水
        let flow = new YwFlow()
        flow.bid =  params.options.bid
        flow.ywid =  params.options.ywid
        flow.dwid =  params.sysuser.dwid
        flow.dwmc =  params.sysuser.dwmc
        flow.userid =  params.sysuser.id
        flow.username =  params.sysuser.name
        flow.sj =  new Date()
        flow.step =  steps[steps.length -1].step
        flow.stepname =  steps[steps.length -1][stepnamefield]
        flow.zt =  1 
        await myRunner.manager.save(flow)

        //给申请人发消息
        let last = steps[steps.length -1]
        let msg = new Messages()
        msg.type =  '业务办理'
        msg.gid =  9000002
        msg.avatarurl = 'https://api.pzhsykj.com:8443/images/my/bmfw.jpg'
        msg.name =  `${last.bname}-${last[stepnamefield]}`
        msg.fromid =  params.sysuser.id
        msg.fromname =  params.sysuser.name
        msg.toids =  [r.sqrid]
        msg.tonames =   [r.sqr]
        msg.path =  last.url1
        msg.initdata =  {ywid:  params.options.ywid, tid:  params.options.tid, bid:  params.options.bid}
        msg.kssj =  new Date()
        msg.showids =  []
        msg.delids =  []
        msg.zt =  '完成'    
        await myRunner.manager.save(msg)

        // 发送微信消息
        let msgs = [] 
        let tousers = [await sysmanager.getuserbyid(r.sqrid)]
        tousers.forEach(d => {
            let scene = encodeURIComponent(`${last.url1}?ywid=${params.options.ywid}&tid=${params.options.tid}&bid=${params.options.bid}`)
            let m = new WxSubscribe()
            m.tousername = d.name
            m.touser = d.openid
            m.template_id = templates[0].id
            m.page = `pages/index/index?q=${scene}`
            let data = new data0()
            data.thing1 = {value: `${last.bname} - ${last[stepnamefield]}`}
            data.thing2 =  {value: `来自${params.sysuser.dwmc} ${params.sysuser.name}`}
            data.thing5 =  {value: "-"}
            data.thing10 =  {value: "行标题无实际意义请忽略！"}
            data.date7 = {value: dateutil.formatTime(new Date())}
            m.data = data
            msgs.push(m)
        })
        if (msgs.length) message.sendsubmsg(msgs)           

        await myRunner.commitTransaction()
        await myRunner.release()
    } catch (e) {
        await myRunner.rollbackTransaction()
        await myRunner.release()
        throw e
    }    
}

//本身是子任务，根据其他子任务是否结束进行路由

async function shbtg12(task, params) {
    try {
        let t1 = getManager().getRepository(Tasks1)
        let r1 = await t1.find({
            pid: task.pid
        })

        var isok = r1.every(d => {
            return d.id === task.id || (d.hdbj!=null && d.hdbj!= undefined)
        }); 

        if (isok) await shbtg122(params) //本身是子任务，所有子任务都结束
        else await shbtg121(params) //本身是子任务，还有子任务未结束
    } catch (e) {
        throw e
    }
}

//本身是子任务，还有子任务未结束
export async function shbtg121 (params) {
    let myRunner = getManager().connection.createQueryRunner()
    await  myRunner.startTransaction()
    try {
        
        //修改业务表
        let t = myRunner.manager.getRepository(Ywsqb)
        let r = await t.findOne({
            id: params.options.ywid
        })
        Object.assign(r, params.ywb)
        r.runids = (<Array<Number>>r.runids).concat([params.sysuser.id])
        r.runnames =  (<Array<string>>r.runnames).concat([params.sysuser.name])

        await myRunner.manager.save(r)

        
        //修改任务表
        let t1 = myRunner.manager.getRepository(Tasks1)
        let r1 = await t1.findOne({
            id: params.options.tid
        })

        Object.assign(r1, params.task)
        r1.runid = params.sysuser.id
        r1.runname = params.sysuser.name
        r1.jssj = new Date()
        r1.zt = 0
        r1.hdbj = 4
        await myRunner.manager.save(r1)

        //修改流水表
        let t2 = myRunner.manager.getRepository(YwFlow)
        let r2 = await t2.findOne({
            tid: params.options.tid
        })
        r2.userid =  params.sysuser.id
        r2.username = params.sysuser.name
        r2.sj = new Date()
        r2.zt = 1   
        r2.memo1 = params.task.memo1
        r2.memo2 = params.task.memo2
        await myRunner.manager.save(r2)

        await myRunner.commitTransaction()
        await myRunner.release()
    } catch (e) {
        await myRunner.rollbackTransaction()
        await myRunner.release()
        throw e
    }    
}

//本身是子任务，所有子任务都结束
export async function shbtg122 (params) {
    let myRunner = getManager().connection.createQueryRunner()
    await  myRunner.startTransaction()
    try {
        let steps = await ywbl.getsteps(params.options.bid)
        let idx = steps.findIndex(d => d.step === params.step)

        //修改业务表
        let t = myRunner.manager.getRepository(Ywsqb)
        let r = await t.findOne({
            id: params.options.ywid
        })

        let gdw = await unitsrv.getunitbyid(r.gid)
        let stepnamefield = gdw.iszsdw === 1 ? 'name1' : 'name0'

        Object.assign(r, params.ywb)
        r.runids = (<Array<Number>>r.runids).concat([params.sysuser.id])
        r.runnames =  (<Array<string>>r.runnames).concat([params.sysuser.name])
        //处理倒数第二步
        r.step = idx === steps.length -2 ? steps[idx + 1].step : params.step
        r.steps = (<Array<Number>>r.steps).concat(idx === steps.length -2 ? [params.step,  steps[idx + 1].step] :[params.step])
        r.stepname =  idx === steps.length -2 ? steps[idx + 1][stepnamefield]: steps[idx][stepnamefield]
        if (idx === steps.length -2) r.zt = 4
        await myRunner.manager.save(r)

        
        //修改任务表
        let t1 = myRunner.manager.getRepository(Tasks1)
        let r1 = await t1.findOne({
            id: params.options.tid
        })

        Object.assign(r1, params.task)
        r1.runid = params.sysuser.id
        r1.runname = params.sysuser.name
        r1.jssj = new Date()
        r1.zt = 0
        r1.hdbj = 4
        await myRunner.manager.save(r1)

        //修改流水表
        let t2 = myRunner.manager.getRepository(YwFlow)
        let r2 = await t2.findOne({
            tid: params.options.tid
        })
        r2.userid =  params.sysuser.id
        r2.username = params.sysuser.name
        r2.sj = new Date()
        r2.zt = 1   
        r2.memo1 = params.task.memo1
        r2.memo2 = params.task.memo2
        await myRunner.manager.save(r2)

        //如果不是倒数第2步，添加下一step的任务及流水
        if (idx < steps.length - 2) {
            //获取主任务
            let t3 = myRunner.manager.getRepository(Tasks1)
            let max =await t3.findOne({
                id: r1.pid
            })
            let next = steps[idx+1]
            let tousers = await unitywconfigs.getoper(max.dwid, params.options.bid, next.step)
            //添加任务
            let task = new Tasks1()
            task.bid =  params.options.bid
            task.ywid =  params.options.ywid
            task.stepid =  next.id
            task.step =  next.step
            task.stepname =  next[stepnamefield]
            task.dwid =  max.dwid
            task.dwmc =  max.dwmc
            task.fromid =  params.sysuser.id
            task.fromname =  params.sysuser.name
            task.toids =  tousers.map(d=> d.id)
            task.tonames =  tousers.map(d=>d.name)
            task.kssj =  new Date()
            task.url0 =  next.url0
            task.url1 =  next.url1
            task.zt =  1 
            await myRunner.manager.save(task)

            //添加下一step的初始流水
            let flow = new YwFlow()
            flow.tid =  task.id
            flow.bid =  params.options.bid              
            flow.ywid =  params.options.ywid   
            flow.dwid =  max.dwid 
            flow.dwmc =  await sysmanager.getdwmc(max.dwid)            
            flow.step =  next.id
            flow.stepname =  next[stepnamefield]
            flow.zt =  0  
            await myRunner.manager.save(flow)

            //创建消息
            let msg = new Messages()
            msg.type =  '业务办理'
            msg.gid =  9000002
            msg.avatarurl = 'https://api.pzhsykj.com:8443/images/my/bmfw.jpg'
            msg.name =  `${next.bname}-${next[stepnamefield]}`
            msg.fromid =  params.sysuser.id
            msg.fromname =  params.sysuser.name
            msg.toids =  tousers.map(d=> d.id)
            msg.tonames =   tousers.map(d=>d.name)
            msg.path =  next.url1
            msg.initdata =  {ywid:  params.options.ywid, tid:  task.id, bid:  params.options.bid}
            msg.kssj =  new Date()
            msg.showids =  []
            msg.delids =  []
            msg.zt =  '未完成'        
            await myRunner.manager.save(msg)

            // 发送微信消息
            let msgs = [] 
            tousers.forEach(d => {
                let scene = encodeURIComponent(`${next.url1}?ywid=${params.options.ywid}&tid=${task.id}&bid=${params.options.bid}`)
                let m = new WxSubscribe()
                m.tousername = d.name
                m.touser = d.openid
                m.template_id = templates[0].id
                m.page = `pages/index/index?q=${scene}`
                let data = new data0()
                data.thing1 = {value: `${next.bname} - ${next[stepnamefield]}`}
                data.thing2 =  {value: `来自${params.sysuser.dwmc} ${params.sysuser.name}`}
                data.thing5 =  {value: "-"}
                data.thing10 =  {value: "行标题无实际意义请忽略！"}
                data.date7 = {value: dateutil.formatTime(new Date())}
                m.data = data
                msgs.push(m)
            })
            if (msgs.length) message.sendsubmsg(msgs)             
        } else {
            //增加一条办结流水
            let flow = new YwFlow()
            flow.bid =  params.options.bid
            flow.ywid =  params.options.ywid
            flow.dwid =  params.sysuser.dwid
            flow.dwmc =  params.sysuser.dwmc
            flow.userid =  params.sysuser.id
            flow.username =  params.sysuser.name
            flow.sj =  new Date()
            flow.step =  steps[steps.length -1].step
            flow.stepname =  steps[steps.length -1][stepnamefield]
            flow.zt =  1
            myRunner.manager.save(flow)
            //给申请人发消息
            let last =  steps[steps.length -1]
            let msg = new Messages()
            msg.type =  '业务办理'
            msg.gid =  9000002
            msg.avatarurl = 'https://api.pzhsykj.com:8443/images/my/bmfw.jpg'
            msg.name =  `${last.bname}-${last[stepnamefield]}`
            msg.fromid =  params.sysuser.id
            msg.fromname =  params.sysuser.name
            msg.toids =  [r.sqrid]
            msg.tonames =   [r.sqr]
            msg.path =  last.url1
            msg.initdata =  {ywid:  params.options.ywid, tid:  params.options.tid, bid:  params.options.bid}
            msg.kssj =  new Date()
            msg.showids =  []
            msg.delids =  []
            msg.zt =  '完成'        
            await myRunner.manager.save(msg)
            // 发送微信消息
            let msgs = [] 
            let tousers = [await sysmanager.getuserbyid(r.sqrid)]
            tousers.forEach(d => {
                let scene = encodeURIComponent(`${last.url1}?ywid=${params.options.ywid}&tid=${params.options.tid}&bid=${params.options.bid}`)
                let m = new WxSubscribe()
                m.tousername = d.name
                m.touser = d.openid
                m.template_id = templates[0].id
                m.page = `pages/index/index?q=${scene}`
                let data = new data0()
                data.thing1 = {value: `${last.bname} - ${last[stepnamefield]}`}
                data.thing2 =  {value: `来自${params.sysuser.dwmc} ${params.sysuser.name}`}
                data.thing5 =  {value: "-"}
                data.thing10 =  {value: "行标题无实际意义请忽略！"}
                data.date7 = {value: dateutil.formatTime(new Date())}
                m.data = data
                msgs.push(m)
            })
            if (msgs.length) message.sendsubmsg(msgs)            
        }        
        await myRunner.commitTransaction()
        await myRunner.release()
    } catch (e) {
        await myRunner.rollbackTransaction()
        await myRunner.release()
        throw e
    }    
}