import {getManager, getRepository} from "typeorm";
import {Sysuser} from '../entity/Sysuser'
import * as webAsk from '../utils/webAsk'
import {appid, AppSecret} from '../config/app'
import * as sysvar from '../config/sysvar'
/**
 * 开发者需要在开发者服务器后台调用 auth.code2Session，使用 code 换取 openid 和 session_key 等信息
 * 
 */
export async function getuseridinfo (code: string){
    try {
        const w = await webAsk.get1(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`);
        const wxuserinfo = JSON.parse(<string>w)
        const tables = getManager().getRepository(Sysuser);
        let r = await tables.findOne({
            openid: wxuserinfo['openid']
        })
        if (!r) {
            let r1 = await tables.findOne({
                unionid: wxuserinfo['unionid']
            });
            if (r1) { 
                r1.openid = wxuserinfo['openid'];
                await getManager().save(r1);
            }
        }
        return Object.assign({}, {wxuserinfo: wxuserinfo, sysuser: r}) 
    } catch (e) {
        throw e
    }
}

/**
 * 获取小程序全局唯一后台接口调用凭据（access_token）。调用绝大多数后台接口时都需使用 access_token，开发者需要进行妥善保存。
 * 
 */
let serverToken = {
    time: (new Date()).getTime(),
    token: null
}

export async function get_access_token () {
    let tokenerr = false
    if (!serverToken.token) tokenerr = true
    else {
        let times = ((new Date()).getTime() - serverToken.time)/1000
        if ((serverToken.token["expires_in"] - times) < 60 ) tokenerr = true
    }

    if (tokenerr) {
        try {
            let retstr = await webAsk.get1(`${sysvar.miniapprooturi}/token?grant_type=client_credential&appid=${sysvar.appid}&secret=${sysvar.AppSecret}`)
            let ret = JSON.parse(<string>retstr)
            if (!ret["errcode"] ) {
                serverToken = {
                    time: (new Date()).getTime(),
                    token: {access_token: ret["access_token"], expires_in: ret["expires_in"]}
                }
                return serverToken.token["access_token"]
            } else {
                let e =retstr
                throw e
            }
        } catch (e) {
            throw e
        }

    } else {
        return serverToken.token["access_token"]
    }

}


/**
 * 获取公众号图文新闻
 */

export async function getgzhnews (params) {
    return await webAsk.get1(`https://api.pzhsykj.com/api/pzhjj//pzhjj_WApi_sys/getnews?offset=${params.offset}&size=${params.size}`);
 }

/**
 * 下发小程序和公众号统一的服务消息
 */

 export async function send2msg (msg) {
    let token = await get_access_token()
    return await webAsk.postFormJson(`${sysvar.miniapprooturi}/message/wxopen/template/uniform_send?access_token=${token}`, msg);
 }

 /**
 * 下发订阅消息
 */

export async function sendsubmsg (msg) {
    let token = await get_access_token()
    return await webAsk.postFormJson(`${sysvar.miniapprooturi}/message/subscribe/send?access_token=${token}`, msg);
 }