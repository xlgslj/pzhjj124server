import * as wss from '../../wssserver'
import {getManager, getRepository} from "typeorm";
import {Sysuser} from '../../entity/Sysuser'
import {Menus} from '../../entity/Menus'
import {Codes} from '../../entity/Codes'
import {Role} from '../../entity/Role'
import * as tool from '../../utils/tools/tool1'
import {token} from '../../utils/token'
import * as webask from '../../utils/webAsk'
import * as sysvar from '../../config/sysvar'
/**
 * 微信推送数据，格式如下
 * {
  ToUserName: 'gh_ab313f63a992',
  FromUserName: 'oZBq21D0XLVJWei-Ifyobw5S0JOc',
  CreateTime: '1584285673',
  MsgType: 'event',
  Content: null,
  Location_X: null,
  Location_Y: null,
  Scale: null,
  Label: null,
  PicUrl: null,
  Event: 'SCAN',
  EventKey: 'appid:wx4a908a2f8149abbc[SPACE]scanlogin[-]18d8cb87-8dc0-46be-a2d2-2fefdb88e986',
  Ticket: null,
  MediaId: null,
  ThumbMediaId: null
}
 */
let usercheck = async (pubopenid: any) => {
    try {
        const rows = getManager().getRepository(Sysuser);
        const r = await rows.findOne({
            pubopenid: pubopenid,
        })
        if (r) {
            const appid ="appid-" + r.id + "-" + (new Date()).getTime()
            return Object.assign({},{user: r, appid: appid})
        } else {
            throw "用户名或密码错误";            
        }
    } catch (e) {
        throw e;
        
    }
}

let getmenus = async (user:Sysuser) => {
    try {
        const where = `JSON_CONTAINS(JSON_ARRAY(${user.qxs}),JSON_ARRAY(id)) order by pid,sort`;
        const m = await getRepository(Menus).createQueryBuilder().select().where(where).getMany();
        return m;

    } catch (e) {
        throw e;
        
    }
}
//通过角色获取最终菜单
let getrolemenus = async (user:Sysuser) => {
    try {
        const where = `JSON_CONTAINS(JSON_ARRAY(${user.qxs}),JSON_ARRAY(id))`;
        const r = await getRepository(Role).createQueryBuilder().select().where(where).getMany();
        let m = []
        for (let o of r) {
            m = m.concat(o.qxs)
        }
        m = tool.unique(m)
        const where1 = `JSON_CONTAINS(JSON_ARRAY(${m}),JSON_ARRAY(id)) order by pid,sort`;
        const menus = await getRepository(Menus).createQueryBuilder().select().where(where1).getMany();
        return menus;

    } catch (e) {
        throw e;
        
    }
}

let getcodes = async () => {
    try {
        const tables = getManager().getRepository(Codes);
        let r = await tables.find()
        return r;

    } catch (e) {
        throw e;
        
    }   
}

const scanlogin = async (uuid:string, wxdata) => {
    try {
        const u = await usercheck(wxdata.FromUserName);
        let m
        if (u.user.qxlx === '独立权限') m = await getmenus(u.user);
        else m = await getrolemenus(u.user);
        const c = await getcodes();
        const t = token.createToken(JSON.stringify(u))        
        const umc = Object.assign(u, {menus: m, codes: c})
        const umcte = Object.assign(umc, {token: t, event: 'scanlogon'})

        //完善websocket客户端里的关联信息
        const idx = wss.data.onlineclients.findIndex(x => x.uuid ===uuid)
        if (idx >= 0) {
            wss.data.onlineclients[idx].scope = 'web'
            wss.data.onlineclients[idx].appid = u.appid
            wss.data.onlineclients[idx].uid = u.user.id
            wss.data.onlineclients[idx].name =u.user.name
            wss.data.onlineclients[idx].time = new Date()
        }
        wss.send({
            event: 'logon',
            id: u.user.id,
            name: u.user.name
        })
        wss.updateusers()
        wss.sendtobyuuid([uuid], umcte)
    } catch (e) {
        wss.sendtobyuuid([uuid], {event:'scanlogerr'})
    }
}

const userbind = async (uid, wxdata) => {
    try {
        const rows = getManager().getRepository(Sysuser);
        const r = await rows.findOne({
            id: uid
        })
        //获取unionid 
        const wxuserinfo = await webask.get1(`${sysvar.getwxuserinfourl}?openid=${wxdata.FromUserName}`)
        r.unionid = JSON.parse(<string>wxuserinfo).unionid;
        r.pubopenid = wxdata.FromUserName
        await getManager().save(r);
        wss.sendtobyuid([parseInt(uid)], {event:'userbindok',pubopenid:wxdata.FromUserName})
    } catch (e) {
        wss.sendtobyuid([uid], {event:'userbinderr'})
    }
}

export async function eventHandle (wxdata) {
    try {
        const eventkeys = wxdata.EventKey.split("[SPACE]")[1].split("[-]")
        switch (eventkeys[0]) {
            case 'scanlogin' : 
                return await scanlogin(eventkeys[1], wxdata)
                break;
            case 'userbind' : 
                return await userbind(eventkeys[1], wxdata)
                break;
            default: 
            break;
        }
    } catch (e) {
        throw "微信事件错误"
    }
}