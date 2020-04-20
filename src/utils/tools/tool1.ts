/**
 * 拷贝对象属性，生成新实例
 */
export function objcopybynew<T> (c: new () => T, source: any) : T {
    let o = new c()
    for(let k in source) {
        o[k] = source[k]
    }
    return o;
}
/**
 * 拷贝对象属性到已有实例
 */
export function objcopybyexit<T> (target: T, source: any, all: boolean) : T {
    for(let k in target) {
        if (all || source[k]) target[k] = source[k]
    }
    return target;
}

/**
 * 生成单位树形结构，{value:1,label:'xx',children:[]}
 */
export function getTree (data, pid, key = 'id', label = 'name') {
    let result = []
    let temp
    for (let i = 0; i < data.length; i++) {
        if (data[i].pid == pid) {
            temp = getTree(data, data[i].id, 'id', 'dwmc')
            let v = Object.assign({...data[i]}, {key: data[i][key], label: data[i][label]})
            if (temp.length > 0) {
                v["children"] = temp
            }
            result.push(v)
        }
    }
    return result
}

/***
 * 数组去重
 */
export function unique (arr) {
    return Array.from(new Set(arr))
}