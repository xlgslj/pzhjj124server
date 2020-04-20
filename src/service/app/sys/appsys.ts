import {getManager, getRepository} from "typeorm";
import {Sysuser} from '../../../entity/Sysuser'
import {Menus} from '../../../entity/Menus'
import {Role} from '../../../entity/Role'
import {Codes} from '../../../entity/Codes'

import * as tool from '../../../utils/tools/tool1'



/**
 * 获取用户菜单和编码
 * 参数：openid:string
 */
export async function getMenusAndCode(openid:string) {
    try {
        let getuser = async (openid:string) => {
            try {
                const users = getRepository(Sysuser)
                return await users.findOne({
                    openid: openid
                })
            } catch (e) {

            }
        }
        let getmenus = async (user:Sysuser) => {
            try {
                const where = `JSON_CONTAINS(JSON_ARRAY(${user.qxs}),JSON_ARRAY(id)) and isapp = '是' order by pid,sort`;
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
                const where1 = `JSON_CONTAINS(JSON_ARRAY(${m}),JSON_ARRAY(id))  and isapp = '是' order by pid,sort`;
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

        const u = await getuser(openid);
        let m = [];
        if (u) {
            if (u.qxlx === '独立权限') m = await getmenus(u);
            else m = await getrolemenus(u);
        }

        const c = await getcodes();
        return Object.assign({},{menus: m, codes: c})
    } catch (e) {
        throw e;
    }
}
