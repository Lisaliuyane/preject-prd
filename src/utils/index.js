/* eslint-disable */
import OSS from 'ali-oss'
import uuidv3  from 'uuid/v1'

export const imgClient = () =>{ //阿里云配置
    return new OSS({
        region: 'oss-cn-shenzhen',//你的oss地址 ，具体位置见下图
        accessKeyId: 'LTAIbH8hu0UeKsCM',//你的ak
        accessKeySecret: 'h3RdiKm0ohUUN5tzRMoZ0nvqh0ohOp',//你的secret
        //stsToken: '<Your securityToken(STS)>',//这里我暂时没用，注销掉
        bucket: 'frdscm',//你的oss名字
        //imageHost: 'oss-cn-shenzhen.aliyuncs.com'
    })
}

export const random_string = () => { //生成uuid
    let reg = /-/g;
    let pwd = uuidv3().replace(reg, '')
    return pwd;
}

export const get_suffix = (filename) => { //截取文件后缀名a.png => png
    let pos = filename.lastIndexOf('.')
    let suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

export const addressToString = (address) => {
    // try {
    //     if(typeof(address) === 'object') {
    //         return address
    //     }
    //     else if (typeof(address) === 'string' && address.startsWith('{')) {
    //         address = JSON.parse(address)
    //     } else {
    //         return address
    //     }
    // } catch (e) {
    //     console.error('地址解析错误', e)
    // }
    let addressData = {}
    if(typeof(address) === 'object') {
        addressData =  address
    } else if (typeof(address) === 'string' && address.startsWith('{')) {
        addressData = JSON.parse(address)
    } else {
        addressData =  address
    }
    let s = ''
    if (addressData && addressData.pro && addressData.pro.name) {
        s += addressData.pro.name
    }

    if (addressData && addressData.city && addressData.city.name) {
        s += '/'
        s += addressData.city.name
    }

    if (addressData && addressData.dist && addressData.dist.name) {
        s += '/'
        s += addressData.dist.name
    }

    if (addressData && addressData.street && addressData.street.name) {
        s += '/'
        s += addressData.street.name
    }

    if (addressData && addressData.extra) {
        s += ' '
        s += addressData.extra
    }

    return s
}

export const analysisMapAddress = (address) => { //解析程 => '广东省深圳市xxxxx'
    let addressData = {}
    if(typeof(address) === 'object') {
        addressData =  address
    } else if (typeof(address) === 'string' && address.startsWith('{')) {
        addressData = JSON.parse(address)
    } else {
        addressData =  address
    }
    let s = ''
    if (addressData && addressData.pro) {
        s += addressData.pro
    }

    if (addressData && addressData.city) {
        s += addressData.city
    }

    if (addressData && addressData.dist) {
        s += addressData.dist
    }

    if (addressData && addressData.street) {
        s += addressData.street
    }

    if (addressData && addressData.extra) {
        s += addressData.extra
    }

    return s
}

export const getAddressExtra = (address) => { //获取地址的详细地址
    let addressData = {}
    if(typeof(address) === 'object') {
        addressData =  address
    } else if (typeof(address) === 'string' && address.startsWith('{')) {
        addressData = JSON.parse(address)
    } else {
        addressData =  address
    }
    let s = ''
    if (addressData && addressData.extra) {
        s += addressData.extra
    }

    return s
}

export const addressFormat = (address) => {
    try {
        if (typeof(address) === 'string' && address.startsWith('{')) {
            address = JSON.parse(address)
        } else if (typeof(address) === 'string') {
            return address
        }
    } catch (e) {
        // console.error('地址解析错误', e)
        return address
    }
    if(address && address.formatAddress) {
        return address.formatAddress
    } else if(address && address.pro && address.pro.name) {
        addressToString(address)
    }
    return ''
}

export const dedupe = (array) => { //数组去重
    return Array.from(new Set(array));
}

export const addressToCity = (address) => { //解析地址到city层
    try {
        if (typeof(address) === 'string' && address.startsWith('{')) {
            address = JSON.parse(address)
        } else if (typeof(address) === 'string') {
            return address
        }
    } catch (e) {
        return address
    }
    let s = ''
    if (address && address.pro && address.pro.name) {
        s += address.pro.name
    }

    if (address && address.city && address.city.name) {
        s += '/'
        s += address.city.name
    }

    return s
}

export const addressToPlaceholder = (address) => {
    let s = []
    if (address && address.pro && address.pro.name) {
        s.push(address.pro.name)
    } else {
        s.push(null)
    }

    if (address && address.city && address.city.name) {
        s.push(address.city.name)
    } else {
        s.push(null)
    }

    if (address && address.dist && address.dist.name) {
        s.push(address.dist.name)
    } else {
        s.push(null)
    }

    if (address && address.street && address.street.name) {
        s.push(address.street.name)
    } else {
        s.push(null)
    }
    return s
}

export const isArray = (o) => {
    if (typeof o !== 'object') {
        return false
    }
    return Object.prototype.toString.call(o)=='[object Array]';
}

export const stringToArray = (d) => {  //将'[]'转为array数组即[]
    if (isArray(d)) {
        return d
    }
    if (typeof d === 'string') {
        try {
            let array = JSON.parse(d)
            if (isArray(array)) {
                return array
            }
        } catch (e) {
        }
    }
    return []
}

export const stringObjectObject = (d) => {  //将'{}'转为{}
    try {
        if (typeof(d) === 'string' && d.startsWith('{')) {
            d = JSON.parse(d)
            return d
        } else if (typeof(d) === 'string') {
            d = JSON.parse(d)
            return d
        }
    } catch (e) {
        // console.error('地址解析错误', e)
        return d
    }
}

/** 
 * 处理对象中的 undefined、null、0
 * o：要处理的对象
 * ignoreKys：忽略的对象键值
 * isIgnore is object： isIgnoreZero： 是否忽略键值为零， isIgnoreNull： 是否忽略键值为null
*/
export const deleteNull = (o, ignoreKys = [], isIgnore = {isIgnoreZero: false, isIgnoreNull: false}) => {
    if (!isArray(ignoreKys)) {
        //console.error('deleteNull ignoreKys is not a array', 'o =', o, 'ignoreKys = ', ignoreKys)
        return o
    }
    if (typeof o === 'object') {
        for (let key in o) {
            if (!(key === 'offset' && o[key] === 0) && !o[key] && (isIgnore.isIgnoreZero ? o[key] !== 0 : true) && (isIgnore.isIgnoreNull ? o[key] !== null : true) && key !== 'offset' && key !== 'paymentTerms' && ignoreKys.filter(item => key === item).length < 1) {
                delete o[key]
            }
        }
    }
    return o
}

export const s2ab = (s) => {
    s = window.atob(s)
    let buf = new ArrayBuffer(s.length)
    let view = new Uint8Array(buf)
    for (let i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
    return buf
}

export const cloneObject = function(obj) {
    let str
    if (typeof obj !== 'object') {
        return obj
    }
    let newobj = obj.constructor === Array ? [] : {}
    if (typeof obj !== 'object') {
        return
    } else if (window.JSON) {
        try {
            str = JSON.stringify(obj) // 系列化对象
            newobj = JSON.parse(str) // 还原
        } catch (e) {
            //console.log('cloneObject', obj)
            if (isArray(obj)) {
                return [...obj]
            } else {
                return {...obj, render: obj.render}
            }
        }
        
    } else {
        for (let i in obj) {
            newobj[i] = typeof obj[i] === 'object' ? cloneObject(obj[i]) : obj[i]
        }
    }
    // console.log('cloneObject newobj', newobj)
    return newobj
}

export const objDeepCopy = (source) => { // d对象数组的深拷贝
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}

export const trim = (str) => { //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

export const validateToNextQQorEmail = (rule, value, callback) => {
    //console.log('value', value)
    let reg_email = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
    let reg_qq = /^[1-9][0-9]{4,9}$/gim
    if(reg_email.test(value) || reg_qq.test(value)){
        callback() 
    } else{
        callback('邮箱/QQ格式错误'); 
    }
}

export const validateToNextPhone = (rule, value, callback) => { //匹配电话或手机
    let reg_tPhone = /^[1]{1}[3,4,5,6,7,8,9]{1}[0-9]{9}$/
    let reg_phone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
    if(reg_tPhone.test(value) || reg_phone.test(value) || !value || value === ''){
        callback() 
    } else{
        callback('联系电话格式错误'); 
    }
}

export const validateToNextPhoneOrNoNUll = (rule, value, callback) => { //匹配电话或手机并且不能为空
    let reg_tPhone = /^[1]{1}[3,4,5,6,7,8,9]{1}[0-9]{9}$/
    let reg_phone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
    if(value === '' || !value) {
        callback('请填写联系方式')
    } else{
        if(reg_tPhone.test(value) || reg_phone.test(value)){
            callback() 
        } else{
            callback('格式错误'); 
        }
    }
}

export const validateToCellPhone = (rule, value, callback) => { //匹配手机号
    let reg_tPhone = /^[1]{1}[3,4,5,6,7,8,9]{1}[0-9]{9}$/
    if(reg_tPhone.test(value) || value === '' || !value){
        callback() 
    } else{
        callback('手机号格式错误'); 
    }
}

export const validateToCellPhoneAndNoNull = (rule, value, callback) => { //匹配手机号不能为空
    let reg_tPhone = /^[1]{1}[3,4,5,6,7,8,9]{1}[0-9]{9}$/
    if(value === '' || !value) {
        callback('请填写手机号'); 
    } else if(reg_tPhone.test(value)){
        callback() 
    } else{
        callback('手机号格式错误'); 
    }
}

export const validateToNextQQ = (rule, value, callback) => {
    //console.log('value', value)
    let reg_qq = /^[1-9][0-9]{4,9}$/gim
    if(reg_qq.test(value) || !value || value === ''){
        callback() 
    } else{
        callback('QQ格式错误'); 
    }
}

export const validateToNextCar = (rule, value, callback) => { //匹银行卡号
    let reg_card = /^\d{5,25}$/
    if(reg_card.test(value) || !value || value === ''){
        callback() 
    } else{
        callback('银行卡号格式错误'); 
    }
}

export const validateUsername = (rule, value, callback) => { //不能为中文并且长度在4-16位并且不能为空
    let reg = /^[a-zA-Z0-9_-]{4,16}$/
    if(!value || value === ''){
        callback('请填写用户账号!') 
    } else if(reg.test(value)) {
        callback()
    } else {
        callback('账号由字母，数字，下划线组成且长度为4-16位!')
    }
}

export const validateNumberAndText = (rule, value, callback) => { //匹配数字和字母
    let reg = /^[0-9a-zA-Z]+$/
    if(reg.test(value) || !value || value === '') {
        callback()
    } else {
        callback('只能为数字和字母！')
    }
}

export const validateCarCodeAndNoNull = (rule, value, callback) => { //车牌号码校验包含新能源
    var xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}|[黑黄蓝绿]{1}$/
    if(!value || value === ''){
        callback('车牌号不能为空!') 
    } else if(xreg.test(value)) {
        callback()
    } else {
        callback('车牌格式错误!')
    }
}

export const validateCarCode = (rule, value, callback) => { //车牌号码校验包含新能源
    var xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}|[黑黄蓝绿]{1}$/
    //var creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
    if(xreg.test(value) || !value || value === null) {
        callback()
    } else {
        callback('车牌格式错误!')
    }
}

let base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const CryptoUtil = {

   // Bit-wise rotate left
   rotl: function (n, b) {
       return (n << b) | (n >>> (32 - b));
   },

   // Bit-wise rotate right
   rotr: function (n, b) {
       return (n << (32 - b)) | (n >>> b);
   },

   // Swap big-endian to little-endian and vice versa
   endian: function (n) {

       // If number given, swap endian
       if (n.constructor == Number) {
           return CryptoUtil.rotl(n,  8) & 0x00FF00FF |
           CryptoUtil.rotl(n, 24) & 0xFF00FF00;
       }

       // Else, assume array and swap all items
       for (var i = 0; i < n.length; i++)
           n[i] = CryptoUtil.endian(n[i]);
       return n;

   },

   // Generate an array of any length of random bytes
   randomBytes: function (n) {
       for (var bytes = []; n > 0; n--)
           bytes.push(Math.floor(Math.random() * 256));
       return bytes;
   },

   // Convert a string to a byte array
   stringToBytes: function (str) {
       var bytes = [];
       for (var i = 0; i < str.length; i++)
           bytes.push(str.charCodeAt(i));
       return bytes;
   },

   // Convert a byte array to a string
   bytesToString: function (bytes) {
       var str = [];
       for (var i = 0; i < bytes.length; i++)
           str.push(String.fromCharCode(bytes[i]));
       return str.join("");
   },

   // Convert a string to big-endian 32-bit words
   stringToWords: function (str) {
       var words = [];
       for (var c = 0, b = 0; c < str.length; c++, b += 8)
           words[b >>> 5] |= str.charCodeAt(c) << (24 - b % 32);
       return words;
   },

   // Convert a byte array to big-endian 32-bits words
   bytesToWords: function (bytes) {
       var words = [];
       for (var i = 0, b = 0; i < bytes.length; i++, b += 8)
           words[b >>> 5] |= bytes[i] << (24 - b % 32);
       return words;
   },

   // Convert big-endian 32-bit words to a byte array
   wordsToBytes: function (words) {
       var bytes = [];
       for (var b = 0; b < words.length * 32; b += 8)
           bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
       return bytes;
   },

   // Convert a byte array to a hex string
   bytesToHex: function (bytes) {
       var hex = [];
       for (var i = 0; i < bytes.length; i++) {
           hex.push((bytes[i] >>> 4).toString(16));
           hex.push((bytes[i] & 0xF).toString(16));
       }
       return hex.join("");
   },

   // Convert a hex string to a byte array
   hexToBytes: function (hex) {
       var bytes = [];
       for (var c = 0; c < hex.length; c += 2)
           bytes.push(parseInt(hex.substr(c, 2), 16));
       return bytes;
   },

   // Convert a byte array to a base-64 string
   bytesToBase64: function (bytes) {

       // Use browser-native function if it exists
       if (typeof btoa == "function") return btoa(CryptoUtil.bytesToString(bytes));

       var base64 = [],
           overflow;

       for (var i = 0; i < bytes.length; i++) {
           switch (i % 3) {
               case 0:
                   base64.push(base64map.charAt(bytes[i] >>> 2));
                   overflow = (bytes[i] & 0x3) << 4;
                   break;
               case 1:
                   base64.push(base64map.charAt(overflow | (bytes[i] >>> 4)));
                   overflow = (bytes[i] & 0xF) << 2;
                   break;
               case 2:
                   base64.push(base64map.charAt(overflow | (bytes[i] >>> 6)));
                   base64.push(base64map.charAt(bytes[i] & 0x3F));
                   overflow = -1;
           }
       }

       // Encode overflow bits, if there are any
       if (overflow != undefined && overflow != -1)
           base64.push(base64map.charAt(overflow));

       // Add padding
       while (base64.length % 4 != 0) base64.push("=");

       return base64.join("");

   },

   // Convert a base-64 string to a byte array
   base64ToBytes: function (base64) {

       // Use browser-native function if it exists
       if (typeof atob == "function") return CryptoUtil.stringToBytes(atob(base64));

       // Remove non-base-64 characters
       base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

       var bytes = [];

       for (var i = 0; i < base64.length; i++) {
           switch (i % 4) {
               case 1:
                   bytes.push((base64map.indexOf(base64.charAt(i - 1)) << 2) |
                              (base64map.indexOf(base64.charAt(i)) >>> 4));
                   break;
               case 2:
                   bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & 0xF) << 4) |
                              (base64map.indexOf(base64.charAt(i)) >>> 2));
                   break;
               case 3:
                   bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & 0x3) << 6) |
                              (base64map.indexOf(base64.charAt(i))));
                   break;
           }
       }
       return bytes;
   }

}

// 判断是否json格式字符串
export const isJsonString = (str) => {
    try {
        if (typeof JSON.parse(str) == "object") {
            return true
        }
    } catch (e) {

    }
    return false
}

// 判断是否空字符
export const isEmptyString = (str) => {
    try{
        if (trim(str).length < 1 || trim(str) === '' || trim(str) === null) {
            return true
        }
    } catch (e) {

    }
    return false
}

export const getBillingMethodId = () => { //获取报价计费id
    if (process.env.NODE_ENV === 'production') {
        return 155
    }
    return 139
}

export const fullScreen = (element) => { //全屏模式
    if(element.requestFullScreen) { 
        element.requestFullScreen()
    } else if(element.webkitRequestFullScreen ) { 
        element.webkitRequestFullScreen() 
    } else if(element.mozRequestFullScreen) { 
        element.mozRequestFullScreen()
    } 
}

export const exitScreen = () => { //取消全屏模式
    if(document.exitFullscreen) {
        document.exitFullscreen()
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    }
}

// 重置 antd form表单错误提示 参数 form 表单指针
export const resetFormError = (form) => {
    if (!form) return
    let vals = form.getFieldsValue()
    let resetArr = []
    for (let key of Object.keys(vals)) {
        if (!vals[key]) {
            resetArr.push(key)
        }
    }
    form.resetFields(resetArr)
}
