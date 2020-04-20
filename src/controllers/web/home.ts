import {CRobj, IRobj} from '../manage/baseClass'
let route = new CRobj();
route.get('/',async (ctx, next) => {
        ctx.response.body = `<h1>typeorm init --name pzhserver1 --database mysql</h1>
            `;
    }
)
export {route}