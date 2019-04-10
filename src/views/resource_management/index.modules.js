import load from '@src/views/layout/modules_load'

const RES_CARRIER = load(() => import('./base/carrier'))
const RES_DRIVER = load(() => import('./base/driver'))

const module = {
    RES_CARRIER: {
        component: RES_CARRIER,
        name: '承运商资源'
    },
    RES_DRIVER: {
        component: RES_DRIVER,
        name: '司机资源'
    }
}

export default module
