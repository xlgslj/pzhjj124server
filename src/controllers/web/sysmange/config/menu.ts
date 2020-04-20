import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../../types/IChttp'
import {CRobj} from '../../../manage/baseClass'
import {Menus} from '../../../../entity/Menus'
import * as tool from '../../../../utils/tools/tool1'
import {Sysuser} from '../../../../entity/Sysuser'
import {Role} from '../../../../entity/Role'
let route = new CRobj();
/**
 * 获取系统菜单
 * 参数:
 */
route.get('/web/sysmanage/config/menu/get', async (ctx, next) => {
    try {
        const ret = new  IChttp.CRet(1);
        const where = ``;
        ret.data = await getRepository(Menus).createQueryBuilder().select().orderBy('sort').where(where).getMany();
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
})

/**
 * 获取用户所有授权菜单，含小程序
 * 参数:
 */
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
route.get('/web/sysmanage/config/menu/getuserallmenus', async (ctx, next) => {
    try {
        let id = ctx.query.id
        let t = getManager().getRepository(Sysuser)
        let user = await t.findOne({
            id: id
        })
        let m
        if (user.qxlx === '独立权限') m = await getmenus(user);
        else m = await getrolemenus(user);        
        const ret = new  IChttp.CRet(1);
        ret.data = m
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
})

/**
 * 修改菜单sort
 * 参数:[ { id: 2, sort: 2 }, { id: 5, sort: 1 } ]
 */
route.post('/web/sysmanage/config/menu/resort', async (ctx, next) => {
    try {
        let data =ctx.request.body
        const ret = new  IChttp.CRet(1);
        const tables = getManager().getRepository(Menus);
        let r1 = await tables.findOne({id: data[0].id });
        r1.sort = data[0].sort;
        await getManager().save(r1);
        let r2 = await tables.findOne({id: data[1].id });
        r2.sort = data[1].sort;
        await getManager().save(r2);
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
})
/**
* 添加菜单
* 参数:{
  id: null,
  pid: 17,
  xtlx: 'ALL',
  sylx: '警用',
  lb: '菜单',
  name: '新菜单',
  view: '打发打发 ',
  sort: 1,
  children: null
}
*/
route.post('/web/sysmanage/config/menu/add', async (ctx, next) => {
   try {
       let data =ctx.request.body
       const ret = new  IChttp.CRet(1);
       let m = tool.objcopybynew<Menus>(Menus, data)
       ret.data = await getManager().save(m);
       ctx.response.body = ret
   } catch (e) {
       const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
       ret.err = e.toString();
       ctx.response.body = ret
   }    
})

/**
* 修改菜单
* 参数:{
  id: null,
  pid: 17,
  xtlx: 'ALL',
  sylx: '警用',
  lb: '菜单',
  name: '新菜单',
  view: '打发打发 ',
  sort: 1,
  children: null
}
*/
route.post('/web/sysmanage/config/menu/edit', async (ctx, next) => {
    try {
        let req =ctx.request.body
        const ret = new  IChttp.CRet(1);

        const tables = getManager().getRepository(Menus);
        let r1 = await tables.findOne({id: req.id });

        let m = tool.objcopybyexit<Menus>(r1, req, true)
        ret.data = await getManager().save(m);
        
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })
 
/**
* 删除菜单
* 参数:{
  id: 17,
  pid: 1
}
*/
route.post('/web/sysmanage/config/menu/del', async (ctx, next) => {
    try {
        let req =ctx.request.body
        const ret = new  IChttp.CRet(1);

        const tables = getManager().getRepository(Menus);
        let r1 = await tables.findOne({id: req.id });
        if (r1) await tables.remove(r1);

        const where = `pid=${req.pid} order by sort`;
        const ms = await getRepository(Menus).createQueryBuilder().select().where(where).getMany();
        let i = 1;
        for(let m of ms) {
            m.sort = i;
            await getManager().save(m);
            i++;
        }

        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })
export {route}