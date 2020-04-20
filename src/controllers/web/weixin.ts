import * as sysvar from '../../config/sysvar'
import * as IChttp from '../../types/IChttp'
import {CRobj} from '../manage/baseClass'
import * as webask from '../../utils/webAsk'
import * as wxsrvforweb from '../../service/web/weixin'
import * as wxsrv from '../../service/wxservice'
import * as webAsk from '../../utils/webAsk'
let route = new CRobj();
/**
 * 获取登录二维码
 */
route.get('/web/weixin/getqrcode', async (ctx, next) => {
    try
    {
        const data = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        const ticket = await webask.get1(`${sysvar.getqrcodeticketurl}?scene_str=appid:${sysvar.appid}[SPACE]${data.scene}[-]${data.val}`)
        ret.data = `${sysvar.showqrcodeurl}${eval(<string>ticket)}` ;
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }
})

/**
 * 公众号推送回来的事件处理
 */
route.post('/web/weixin/eventcenter', async (ctx, next) => {
    try
    {
        const data =ctx.request.body
        const ret = new  IChttp.CRet(1);
        wxsrvforweb.eventHandle(data)
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }
})



route.get('/web/weixin/getaccess_token', async (ctx, next) => {
    try
    {
        const openid = ctx.request.query.openid;
        const ret = new  IChttp.CRet(1);
        ret.data =  await wxsrv.get_access_token()
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e
        ctx.response.body = ret
    }
})

route.get('/web/weixin/sendmsg', async (ctx, next) => {
    try
    {
        const openid = ctx.request.query.openid;
        const ret = new  IChttp.CRet(1);
        const msg = {
            "touser":"oqjYL49HIPQHtJw_RIZZQ7t4N_mE",
            "mp_template_msg":{
                "appid":"wxdcd68b8351e5e2e5",
                "template_id":"NUjC2MFIJ16ezNwE96z_UXMCNyaeoiXjXnZxJUOVAmI",
                "url":"http://weixin.qq.com/download",
                /*"miniprogram":{
                    "appid":"wx4a908a2f8149abbc",
                    "pagepath":"index"
                },*/
                "data":{
                    "first":{
                        "value":"恭喜你购买成功！",
                        "color":"#173177"
                    },
                    "keyword1":{
                        "value":"巧克力",
                        "color":"#173177"
                    },
                    "keyword2":{
                        "value":"39.8元",
                        "color":"#173177"
                    },
                    "keyword3":{
                        "value":"2014年9月22日",
                        "color":"#173177"
                    },
                    "remark":{
                        "value":"欢迎再次购买！",
                        "color":"#173177"
                    }
                }
            }
        }
        ret.data =  await wxsrv.send2msg(msg)
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e
        ctx.response.body = ret
    }
})

/**
 * 获取公众号图文新闻 
 * 参数{offset: 10, size: 10}
 */
route.get('/web/weixin/getgzhnews', async (ctx, next) => {
    try
    {
        const params = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        ret.data =  await wxsrv.getgzhnews(params)
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e
        ctx.response.body = ret
    }
})

export {route}