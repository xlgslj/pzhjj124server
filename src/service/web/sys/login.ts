import {getManager, getRepository} from "typeorm";
import {Sysuser} from '../../../entity/Sysuser'
import {Menus} from '../../../entity/Menus'
import {Codes} from '../../../entity/Codes'
import {Role} from '../../../entity/Role'
import * as mycrypto from '../../../utils/tools/mycrypto'
import * as tool from '../../../utils/tools/tool1'

let usercheck = async (user: any) => {
    try {
        const rows = getManager().getRepository(Sysuser);
        const r = await rows.findOne({
            uid: user.uid,
            pwd: mycrypto.getsha256(user.pwd)
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
        const where = `JSON_CONTAINS(JSON_ARRAY(${user.qxs}),JSON_ARRAY(id)) and isapp='否' order by pid,sort`;
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
        const where1 = `JSON_CONTAINS(JSON_ARRAY(${m}),JSON_ARRAY(id)) and isapp='否' order by pid,sort`;
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


export async function login(user: any)  {
    const u = await usercheck(user);
    let m
    if (u.user.qxlx === '独立权限') m = await getmenus(u.user);
    else m = await getrolemenus(u.user);
    const c = await getcodes();
    return Object.assign(u, {menus: m, codes: c})
}