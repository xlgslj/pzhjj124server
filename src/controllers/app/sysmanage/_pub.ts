import {getManager, getRepository} from "typeorm";
import { Sysuser } from "../../../entity/Sysuser"
import { Unit } from "../../../entity/Unit"

//根据id获取用户
export async function getuserbyid (id) {
    try {
        let t = getManager().getRepository(Sysuser)
        let rs = await t.findOne({
            id: id
        })
        return rs
    } catch (e) {
        throw e
    }
}

export async function getuserfromdw (dwid, lx) {
    try {
        let t = getManager().getRepository(Sysuser)
        let m 
        if (lx) {
            m = await t.find({
                dwid: dwid,
                isadmin: lx
            })
        } else {
            m = await t.find({
                dwid: dwid
            })
        }
        return m
    } catch (e) {
        throw e
    }    
}

//根据职务获取单位用户
export async function getusersbyzw (dwid, zw) {
    try {
        let t = getManager().getRepository(Sysuser)
        let rs = await t.find({
            dwid: dwid,
            zw: zw
        })
        return rs
    } catch (e) {
        throw e
    }
}

//获取单位名称
export async function getdwmc(dwid) {
    try {
        let t = getManager().getRepository(Unit)
        let r = await t.findOne({
            id: dwid
        })
        return r ? r.dwmc : ''
    } catch (e) {
        throw e
    }
}