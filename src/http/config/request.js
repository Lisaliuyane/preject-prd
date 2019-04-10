import RequestMethod from './http'
import AllApi from './all_api'
// import Api from '../api';

class RequestApi extends RequestMethod {
    constructor(props) {
        super(props)
        this.http = props
    }

}

/** 
 * 组合各个模块的api请求
*/
export default (props) => {
    let requestApi = new RequestApi(props)
    for (let key in AllApi) {
        if (!requestApi[key]) {
            if (AllApi && typeof AllApi[key] === 'function') {
                let api = AllApi[key].prototype
                // requestApi[key] = api
                // console.log('apiapiapiapiapi', AllApi[key].prototype)
                for (let name of Object.getOwnPropertyNames(api)) {
                    if (name !== 'constructor') {
                        requestApi[name] = api[name]
                        // console.log('requestApi', name)
                    }
                }
            } else {
                requestApi[key] = AllApi[key]
            }
        } else {
            console.error(`请求Api${key}名字发生重复`);
        }
    }
    // console.log('requestApi', requestApi)
    return requestApi
}