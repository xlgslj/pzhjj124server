import {CRobj, IRobj} from '../manage/baseClass'
import {getManager,  getRepository} from "typeorm";
import {Person} from "../../entity/Person";
let route = new CRobj();
route.get('/db',async (ctx, next) => {
        ctx.response.body = `<h1>Index</h1>
        <form action="/db/add" method="post">
            <p>Name: <input name="name" value="lj"></p>
            <p>age: <input name="age" value="12"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
    }
)
route.post('/db/add',async (ctx, next) => {
        try
        {
            let data =ctx.request.body
            let p = new Person();
            p.name = data.name;
            p.age = data.age;
            p.tt ={
                name:data.name,
                age:<number>data.age
            }
            p.yy = [1,2,34]
            await getManager().save(p);
            ctx.response.body = `<h1>add ok</h1>`;  
        } catch (e) {
            ctx.response.body = `<h1>add ${e.msg || e}</h1>`;  
        }      
    }
)
route.get('/db/query',async (ctx, next) => {
        try
        {
            /*const tables = getManager().getRepository(Person);
            const ps = await tables.find({
                id: 1
            })*/
            
            const ps1 = await getRepository(Person).createQueryBuilder().select().where("name='lj'").getMany()
            console.log(ps1)
            ctx.response.body = ps1
        } catch (e) {
            ctx.response.body = `<h1>add ${e.msg || e}</h1>`;  
        }      
    }
)
export {route}