import * as https from 'https';
import * as wswserver from './wssserver';
import * as  fs from 'fs';
import * as  path from 'path'          //路径管理
import * as KoaStatic from 'koa-static'  //静态资源服务插件
import  enforceHttps from 'koa-sslify';
import * as koa from'koa';
import * as bodyParser from 'koa-bodyparser'
import {createConnection} from "typeorm";
import {LoadRouter} from './controllers/manage/router'
import {token as tokenapp} from './utils/token'

// 创建一个Koa对象表示web app本身:
const app =new koa();

app.use(enforceHttps());
/*const options = {
    key: fs.readFileSync(`${__dirname}/static/ssl/ssl.key`),
    cert: fs.readFileSync(`${__dirname}/static/ssl/ssl.crt`)
};*/
const options = {
    key: fs.readFileSync(`${__dirname}/static/ssl/127.0.0.1-key.pem`),
    cert: fs.readFileSync(`${__dirname}/static/ssl/127.0.0.1.pem`)
};
const config = {
    host: "127.0.0.1",
    port: 8443
}
// 配置静态资源
const staticPath = './static'
app.use(KoaStatic(
    path.join( __dirname, staticPath)
))
//解析POST请求中数据
app.use(bodyParser());
//自定义中间件，保留
app.use(async (ctx, next) => {
	// 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验 
	let token = ctx.headers.token;
    if (!tokenapp.checkToken(token,ctx.request.path)) {
		let ret={
            status : 0,
            msg:'Token 不存在或已过期'
        }
        ctx.response.body = ret
    } else {
		let v=tokenapp.decodeToken(token)
		// console.log(v)
		if(v){
			//如果token有效且不为空,续订token
            ctx.set("token", tokenapp.createToken(v.payload["data"]))
        }
        await next();
    }
});
//创建服务
(async () => {
    //连接数据库
    await createConnection();
    //动态加载路由
    let route = await LoadRouter();
    app.use(route)
    const server = https.createServer(options, app.callback()).listen(config.port, () => {
        // const host = server.address().address
        const host = config.host;
        const port = config.port;
        console.log(`服务器启动成功: https://${host}:${port}`);
      });    
    //启动WSS服务器
    wswserver.run(server)
    //app.listen(3000) //创建普通http
    //console.log('服务器启动成功，端口：3000')
})();

/*创建http

import * as koa from'koa';
import * as bodyParser from 'koa-bodyparser'
import {createConnection} from "typeorm";
import {LoadRouter} from './controllers/manage/router'
import {token as tokenapp} from './utils/token'
// 创建一个Koa对象表示web app本身:
const app =new koa();
//解析POST请求中数据
app.use(bodyParser());
//自定义中间件，保留
app.use(async (ctx, next) => {
	// 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验 
	let token = ctx.headers.token;
	//console.log('token',token)
    if (!tokenapp.checkToken(token,ctx.request.path)) {
		let ret={
            status : 0,
            msg:'Token 不存在或已过期'
        }
        ctx.response.body = ret
    } else {
		let v=tokenapp.decodeToken(token)
		// console.log(v)
		if(v){
			//如果token有效且不为空,续订token
            tokenapp.createToken(v.payload["data"])
        }
        await next();
    }    
});
//创建服务
(async () => {
    //连接数据库
    createConnection();
    //动态加载路由
    let route = await LoadRouter();
    app.use(route)
    app.listen(8443)
    console.log('服务器启动成功，端口：8443')
})();
*/