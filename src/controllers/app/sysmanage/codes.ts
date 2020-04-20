import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Codes} from '../../../entity/Codes'

let route = new CRobj();

route.get('/app/sysmanage/codes/getall', async (ctx, next) => {
    try {
        const ret = new  IChttp.CRet(1);
        let t = getRepository(Codes)
        let rs = await t.find()
        
        ret.data = rs
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }      
 })

export {route}