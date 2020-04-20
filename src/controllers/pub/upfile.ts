import * as fs from 'fs'
import * as IChttp from '../../types/IChttp'
import {CRobj} from '../manage/baseClass'
import * as formidable from 'formidable'
import * as  path from 'path'          //路径管理
import * as sysvar from '../../config/sysvar'
let route = new CRobj();

function isFormData(req) {
    let type = req.headers['content-type'] || ''
    return type.includes('multipart/form-data')
}
//日期格式化
function formatTime () {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let times = date.getTime()
    return [year, month, day, hour, minute, second, times].map(formatNumber).join('')
  }
  
function formatNumber (n) {
n = n.toString()
return n[1] ? n : '0' + n
}

let root = '../../static'
let subdir = 'upload'
let uploadDir = path.join(__dirname, path.join(root, subdir));

route.post('/pub/upfile', async (ctx, next) => {
    try {
        // 1 判断
        if (!isFormData(ctx)) {
            throw '错误的请求, 请用multipart/form-data格式'
        }
        const form = formidable({ multiples: true });//既处理表单，又处理文件上传
        //设置文件上传文件夹/路径，__dirname是一个常量，为当前路径

        form.uploadDir = uploadDir;//本地文件夹目录路径        
        await new Promise((resolve, reject) => {
            try {
                //添加上传进度
                form.on('progress', (bytesReceived, bytesExpected) => {
                    let percent = Math.floor(bytesReceived / bytesExpected * 100)
                    //console.log(percent)
                })
                form.on('error', err => {
                    throw `文件上传错误：${err}`
                })
                form.parse(ctx.req, (err, fields, files) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    let oldpath = files.file.path;//这里的路径是图片的本地路径
                    let srcname = files.file.name
                    let extname=path.extname(srcname);	 //获取文件的后缀名
                    let newname = `upload_${formatTime()}${extname}`
                    let newPath = path.join(path.dirname(oldpath),newname);    
                    fs.renameSync(oldpath, newPath)

                    const ret = new  IChttp.CRet(1);
                    ret.data =`${sysvar.localhost}/${path.join(subdir, newname).replace(/\\/g,"/")}`
                    ctx.response.body = ret
                    resolve();
                });
            } catch (e) {
                reject(e)
            }
          });    


    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })

 route.post('/pub/delfiles', async (ctx, next) => {
    try {
        let params = ctx.request.body
        let files = params.files
        for (let f of files) {
            try
            {
                let filename = path.basename(f)
                let filepath = path.join(uploadDir,filename)
                fs.unlinkSync(filepath)
            } catch (e) {
                throw e
            }
        }
        const ret = new  IChttp.CRet(1);
        ctx.response.body = ret        
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.err = e.toString();
        ctx.response.body = ret
    }    
 })


export {route}