import {getManager, getRepository} from "typeorm";
import * as IChttp from '../../../types/IChttp'
import {CRobj} from '../../manage/baseClass'
import {Ywsqb} from '../../../entity/Ywsqb'
import * as shbtg from './_shbtg'
import * as sysmanager from '../sysmanage/_pub'
import * as message from '../messages/_pub'
import * as tool from '../../../utils/tools/tool1'
let route = new CRobj();

//不是子任务
route.post('/app/ywbl/shbtg1', async (ctx, next) => {
    try {
        let params =ctx.request.body
        const ret = new  IChttp.CRet(1);
        await shbtg.shbtg1(params)
        ctx.response.body = ret
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

export {route}