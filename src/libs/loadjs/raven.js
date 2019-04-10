export const loadRaven = function() {
    if (!global.Raven) {
        global.Raven = {}
        global.Raven._preloader = new Promise((resolve, reject) => {
            global._initRavenMap = function() {
                resolve(global.Raven)
                global.document.body.removeChild($script)
                global.Raven._preloader = null
                global._initRavenMap = null
            }
            const $script = document.createElement('script')
            global.document.body.appendChild($script)
            $script.src = `https://cdn.ravenjs.com/3.24.0/raven.min.js`
            if ($script.readyState) { // IE
                $script.onreadystatechange = function() {
                    if ($script.readyState === 'complete' || $script.readyState === 'loaded') {
                        $script.onreadystatechange = null
                        global._initaRavenMap()
                    }
                }
            } else { // 非IE
                $script.onload = function() {
                    global._initRavenMap()
                }
            }
        })
        return global.Raven._preloader
    } else if (!global.Raven._preloader) {
        return Promise.resolve(global.Raven)
    } else {
        return global.Raven._preloader
    }
}