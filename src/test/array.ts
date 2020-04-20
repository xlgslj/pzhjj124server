var list = [
    {
        id:0,
        name:"剑圣-刺客",
        type:"刺客"
    },
    {
        id:1,
        name:"安妮-法师",
        type:"法师"
    },
    {
        id:3,
        name:"赵信-战士",
        type:"战士"
    },
    {
        id:4,
        name:"寒冰-射手",
        type:"射手"
    },
    {
        id:4,
        name:"维恩-射手",
        type:"射手"
    },
    {
        id:2,
        name:"蕾欧娜-坦克",
        type:"坦克"
    },
    {
        id:1,
        name:"拉克丝-法师",
        type:"法师"
    },
    {
        id:0,
        name:"劫-刺客",
        type:"刺客"
    },
    {
        id:1,
        name:"凤凰-法师",
        type:"法师"
    },
    {
        id:3,
        name:"皇子-战士",
        type:"战士"
    },
    {
        id:2,
        name:"龙龟-坦克",
        type:"坦克"
    }
]

function groupArr(list,field){
    var fieldList = [],att=[];
    list.map((e)=>{
        fieldList.push(e[field])
    })
    console.log(fieldList)
    //数组去重
    fieldList = fieldList.filter((e,i,self)=>{
        console.log(e, self.indexOf(e), i)
        return self.indexOf(e)==i
    })
     for(var j=0;j<fieldList.length;j++){
        //过滤出匹配到的数据
        var arr = list.filter((e)=>{
            return e[field]==fieldList[j];
        })
        att.push({
            type:arr[0][field],
            list:arr
        })
    }
    return att;
}
let v = groupArr(list,'type')
//console.log(v)