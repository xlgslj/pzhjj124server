import {CRobj} from '../manage/baseClass'
let route = new CRobj();

route.get('/test', async (ctx, next) => {
    ctx.response.body = `11`;
})
export {route}