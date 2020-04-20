import * as request from 'request'
const get1 = async (path: string) => {
    return new Promise((resolve, reject) => {
        request(path, function (err, response, body) {
            if (!err && response.statusCode == 200) { 
                resolve(body)
            }
            else {
                reject(err)
            }
          })   
    })
}

/*get1("https://api.pzhsykj.com/api/pzhjj//pzhjj_wapi_cgs/getsets").then(r=> {
    console.log(r)
})*/

const postForm = async function (url, form) {
    let header = getHeader();
    let option = {
        json: true,
        header : header,
        body: form
    };
    return new Promise((resolve, reject) => {
        request.post(url,option, function (err, response, body) {
            if (!err && response.statusCode == 200) { 
                resolve(body)
            }
            else {
                reject(err)
            }
          })   
    })    
};

const postFormJson = async function (url,form) {
    let header = getHeader();
    let option = {
        url: url,
        method: "POST",
        json: true,
        headers: header,
        body: form
    };
    return new Promise((resolve, reject) => {
        request(option,function (err, response, body) {
            if (!err && response.statusCode == 200) { 
                resolve(body)
            }
            else {
                reject(err)
            }
          })   
    })      
};

function resultFunction(callback,error, response, body){
    if (!error && response.statusCode === 200) {
        callback({success: true, msg: body});
        console.log('request is success ');
    } else {
        console.log('request is error', error);
        callback({success: false, msg: error});
    }
}

function getHeader() {
    return {
        "Content-type": "application/json; charset=UTF-8",
        "Accept": "application/json; charset=UTF-8",
       /* 'auth': {
            'user': 'username',
            'pass': 'password',
            'sendImmediately': false
        }*/
    };
}
/*let param = {'user': 'username','pass': 'password'};
postForm('http://localhost:8080/springboot/params', param, function (result) {
    console.log(result)
});

postFormJson('http://localhost:8080/springboot/params', param, function (result) {
    console.log(result)
});*/

export {get1, postForm, postFormJson}