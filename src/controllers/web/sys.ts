
import {getManager, getRepository} from "typeorm";
import {Menus} from '../../entity/Menus'
import * as IChttp from '../../types/IChttp'
import {CRobj} from '../manage/baseClass'
import * as logsrv from '../../service/web/sys/login'
import {token} from '../../utils/token' 
import * as wss from '../../wssserver'
let route = new CRobj();


/**
 * 系统登录
 * 参数: user=>{uid:string, pwd:string, uuid: string}
 */
route.get('/web/sys/login', async (ctx, next) => {
    try
    {
        const user = ctx.request.query;
        const ret = new  IChttp.CRet(1);
        ret.data =  await logsrv.login(user);
        ctx.set("token", token.createToken(JSON.stringify(Object.assign(ret.data.user,ret.data.appid))));
        //完善websocket客户端里的关联信息
        const idx = wss.data.onlineclients.findIndex(x => x.uuid ===user.uuid)
        if (idx >= 0) {
            wss.data.onlineclients[idx].scope = 'web'
            wss.data.onlineclients[idx].appid = ret.data.appid
            wss.data.onlineclients[idx].uid = ret.data.user.id
            wss.data.onlineclients[idx].name =ret.data.user.name
            wss.data.onlineclients[idx].time = new Date()
        }
        wss.send({
            event: 'logon',
            id: ret.data.user.id,
            name: ret.data.user.name
        })
        wss.updateusers()
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }
})
/**
 * 获取所有菜单，为动态创建组件用
 */
route.get('/web/sys/getmenus', async (ctx, next) => {
    try
    {
        const ret = new  IChttp.CRet(1);
        const tables =getManager().getRepository(Menus);
        ret.data = await tables.find()
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }
})
export {route}