let steps  = [0,1,2,3,4,5,6,7,8]
let step  = 4
let next = 7

function st (src, step, next) {
    //const steps = src.map(d=> d.step)
    let curidx = steps.findIndex(d => d === step)
    let nextidx = steps.findIndex(d => d === next)
    let att = []
    for(let i= curidx; i< nextidx; i++) {
        att.push(steps[i] * (i === curidx ? 1: -1))
    }
    if (nextidx === steps.length -1) att.push(next)
    return att
}

console.log(st(steps, step, next))