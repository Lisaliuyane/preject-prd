export function GetLodop() {
    // 加载百度SDK
    if (!global.LODOP) {
        global.LODOP = {}
        global.LODOP._preloader = new Promise((resolve, reject) => {
            global._initetLodop = function () {
                resolve(global.LODOP)
                global.document.body.removeChild($script)
                global.LODOP._preloader = null
                global._initetLodop = null
            }
            const $script = document.createElement('script')
            $script.async = 'async'
            global.document.body.appendChild($script)
            $script.src = 'http://localhost:8000/CLodopfuncs.js' // `//api.map.baidu.com/api?v=2.0&ak=${ak}&callback=_initBaiduMap`
            if ($script.readyState) { // IE
                $script.onreadystatechange = function () {
                    if ($script.readyState === 'complete' || $script.readyState === 'loaded') {
                        $script.onreadystatechange = null
                        global._initetLodop()
                    }
                }
            } else { // 非IE
                $script.onload = function () {
                    global._initetLodop()
                }
            }
            // const $link = document.createElement('link')
            // global.document.body.appendChild($link)
        })
        return global.LODOP._preloader
    } else if (!global.LODOP._preloader) {
        return Promise.resolve(global.LODOP)
    } else {
        return global.LODOP._preloader
    }
}
