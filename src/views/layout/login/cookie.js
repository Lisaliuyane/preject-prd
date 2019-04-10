const ID = 'frdmanage-a6174143-3aee-419a-b068-c7f503b5f209'
function setLastUser(username) {
    let expdate = new Date()
    // 当前时间加上两周的时间
    expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000))
    setCookie(ID, username, expdate)
}
function setUser(d) {
    // 将最后一个用户信息写入到Cookie
    setLastUser(d.username)
    // 如果记住密码选项被选中
    if (d.isCheck) {
        var expdate = new Date()
        expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000))
        // 将用户名和密码写入到Cookie
        setCookie(d.username, d.password, expdate)
    } else {
        resetCookie(d.username)
    }
    // 如果没有选中记住密码,则立即过期
}
// 写入到Cookie
function setCookie(name, value, expires) {
    document.cookie = name + '=' + escape(value) + ((expires == null) ? '' : ('; expires=' + expires.toGMTString()))
}
function resetCookie(username) {
    let expdate = new Date()
    setCookie(username, null, expdate)
}
function getPwdAndChk(username) {
    return getCookie(username)
}
function getLastUser() {
    let username = getCookie(ID)
    let password = getPwdAndChk(username)
    if (username != null) {
        return { username: username, password: password }
    } else {
        return null
    }
}
function getCookie(name) {
    var arg = name + '='
    var alen = arg.length
    var clen = document.cookie.length
    var i = 0
    while (i < clen) {
        var j = i + alen
        if (document.cookie.substring(i, j) === arg) return getCookieVal(j)
        i = document.cookie.indexOf(' ', i) + 1
        if (i === 0) break
    }
    return null
}
function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(';', offset)
    if (endstr === -1) endstr = document.cookie.length
    return unescape(document.cookie.substring(offset, endstr))
}
export default {
    getLastUser: getLastUser,
    setUser: setUser
}