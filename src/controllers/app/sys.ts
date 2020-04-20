import {getManager, getRepository} from "typeorm";
import {Sysuser} from '../../entity/Sysuser'
import {CRobj} from '../manage/baseClass'
import * as IChttp from '../../types/IChttp'
import * as wxservice from '../../service/wxservice'
import * as appsys from '../../service/app/sys/appsys'
import * as webAsk from '../../utils/webAsk'
import {appid, AppSecret} from '../../config/app'
import { resolve } from 'url';

let route = new CRobj();
/**
 * 用微信临时凭证，换openid,unionid
 * 参数：code:string
 */
route.get('/app/sys/login', async (ctx, next) => {
    try
    {
        const code = ctx.request.query.code;
        const ret = new  IChttp.CRet(1);
        ret.data =  await wxservice.getuseridinfo(code);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e
        ctx.response.body = ret
    }
})

route.get('/app/sys/getUserIdInfo', async (ctx, next) => {
    try
    {
        const code = ctx.request.query.code;
        const ret = new  IChttp.CRet(1);
        const w = await webAsk.get1(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`);
        const wxuserinfo = JSON.parse(<string>w)
        ret.data = wxuserinfo
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e
        ctx.response.body = ret
    }
})


route.get('/app/sys/getSysuser', async (ctx, next) => {
    try
    {
        const openid = ctx.request.query.openid;
        const ret = new  IChttp.CRet(1);
        const tables = getManager().getRepository(Sysuser);
        let r = await tables.findOne({
            openid: openid
        })
        ret.data = r
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e
        ctx.response.body = ret
    }
})

/**
 * 获取用户菜单和编码
 * 参数：openid:string
 */
route.get('/app/sys/menusandcodes', async (ctx, next) => {
    try
    {
        const openid = ctx.request.query.openid;
        const ret = new  IChttp.CRet(1);
        ret.data =  await appsys.getMenusAndCode(openid);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e
        ctx.response.body = ret
    }
})
export {route}