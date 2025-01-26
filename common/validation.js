// 带name表示需要返回对象里面的
// fn代表是自定义规则
// 字符串代表内部规则
// 正则表示需要符合的规则
// err 提示语言
function isEmptyValue(value, type) {
    if (value === undefined || value === null) {
        return true;
    }

    if (type === 'array' && Array.isArray(value) && !value.length) {
        return true;
    }

    if (isNativeStringType(type) && typeof value === 'string' && !value) {
        return true;
    }

    return false;
}
function isNativeStringType(type) {
    return type === 'string' || type === 'url' || type === 'hex' || type === 'email' || type === 'pattern';
}
export default class {
    constructor(that,data) {
        this.that = that
        this.data = data
        this.rulesArr = []
        this.arr= []
        this.out=[]
    }
	/*
     * 添加规则
     * @param {String} name 规则名称
     * @param {String} fn 规则函数
     * @param {String} err 提示语言
     * @param {String} rule 正则表达式
     */
    add(rule) {
        this.rulesArr.push(rule)
    }
    //验证密码
    password(res){
        let reg=/^[0-9]*$/
        if(!reg.test(res)){
            return false
        }
        return true
    }

    num(res) {
		//判断是否为数字
		return /^[0-9]*$/.test(res)
	}
    //非空属性
    must(arr){
        this.arr = arr
    }
    //返回对象排除
    ruleOut(...out){
        this.out = out
    }
    yz() {
        return new Promise((res, rej) => {
            for (let i = 0; i <this.arr.length; i++) {
                const {name,err }=this.arr[i]
                if(!this.data[name].trim()){
                    return rej(err)
                }
            }
            for (let i = 0; i < this.rulesArr.length; i++) {
                let {name, rule, err} = this.rulesArr[i]
                //判断空值
                // 如果是函数
                if (typeof rule === 'function') {
                    if (!rule.call(this.that, this.data[name])) {
                       return  rej(err)
                    }
                }else if (typeof rule === 'string') {
                    if (!this[rule](this.data[name])) {
                       return  rej(err)
                    }
                } else if (rule instanceof RegExp) {

                    if (!rule.test(this.data[name])) {
                       return  rej(err)
                    }
                }
            }
            let obj = {}
            for (let i in this.data) {
                if (!isEmptyValue(this.data[i]) && this.out.indexOf(i) === -1) {
                    obj[i] = this.data[i]
                }
            }
            res(obj)
        })
    }
}