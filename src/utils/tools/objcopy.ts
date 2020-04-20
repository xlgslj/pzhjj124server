export function objcopybynew<T> (c: new () => T, source: any) : T {
    let o = new c()
    for(let k in source) {
        o[k] = source[k]
    }
    return o;
}

export function objcopybyexit<T> (target: T, source: any, all: boolean) : T {
    for(let k in target) {
        if (all || source[k]) target[k] = source[k]
    }
    return target;
}

