import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../../types/IChttp'
import {CRobj} from '../../../manage/baseClass'
import {Sysuser} from '../../../../entity/Sysuser'
import {Role} from '../../../../entity/Role'
import * as mycrypto from '../../../../utils/tools/mycrypto'
import * as tool from '../../../../utils/tools/tool1'
let route = new CRobj();

route.get('/app/sysmanage/qxgl/user/getusers', async (ctx, next) => {
    try {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        let query = getRepository(Sysuser)
                    .createQueryBuilder()
                    .select()
                    //.where('')
        let u = await query
                        .limit(params.size)
                        .offset(params.offset)
                        .getMany();
        let count = await query.getCount();
        ret.data = {
            users: u,
            total: count
        }
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

 //dwid=0,是固定为小程序设定的角色
 let getroleid =async (zw) => {
     let t = getManager().getRepository(Role)
     let r = await t.findOne({
         dwid: 0,
         uname: zw
     })
     return r.id
 }
 route.post('/app/sysmanage/qxgl/user/add', async (ctx, next) => {
    try {
        let data =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let u = tool.objcopybynew<Sysuser>(Sysuser, data)
        u.qxlx = '角色权限'
        u.qxs = [await getroleid(`${u.type}${u.zw}`)]
        ret.data = await getManager().save(u);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

 route.post('/app/sysmanage/qxgl/user/del', async (ctx, next) => {
    try {
        let {id} =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let t = getManager().getRepository(Sysuser)
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

 route.post('/app/sysmanage/qxgl/user/update', async (ctx, next) => {
    try {
        let {sysuser} =ctx.request.body
        const ret = new  IChttp.CRet(1);
        let t = getManager().getRepository(Sysuser)
        let r = await t.findOne({
            id: sysuser.id
        })
        Object.assign(r, sysuser)
        await getManager().save(r)
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

route.post('/app/sysmanage/qxgl/user/userbind', async (ctx, next) => {
    try {
        let user =ctx.request.body
        const rows = getManager().getRepository(Sysuser);
        const r = await rows.findOne({
            sfzmhm: user.sfzmhm,
            sjhm: user.sjhm
        })

        if (!r) throw "身份证号或手机号未匹配，请联系单位管理员";  
        if (r.openid) throw "用户已经绑定";

        r.openid = user.openid
        if (user.unionid) r.unionid = user.unionid

        const ret = new  IChttp.CRet(1);
        ret.data = await getManager().save(r);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

 route.post('/app/sysmanage/qxgl/user/userunbind', async (ctx, next) => {
    try {
        let user =ctx.request.body
        const rows = getManager().getRepository(Sysuser);
        const r = await rows.findOne({
            id: user.id
        })

        if (!r) throw "用户不存在";  
        r.unionid = null
        r.openid = null
        r.pubopenid = null
        const ret = new  IChttp.CRet(1);
        ret.data = await getManager().save(r);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

export {route}
