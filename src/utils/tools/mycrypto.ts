import * as crypto from "crypto";

export function getsha256 (str: string) {
    //添加签名，防篡改
    var base64Str=Buffer.from(str,"utf8").toString("base64");
    var secret="as@www.pzhsykj.cn";
    var hash=crypto.createHmac('sha256',secret);
        hash.update(base64Str);
    return hash.digest('base64');
}