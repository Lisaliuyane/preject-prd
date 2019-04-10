import load from '@src/views/layout/modules_load'

const CLIENT_STATISTICS = load(() => import('./statistics/index.jsx'))
const CLIENT_BILL = load(() => import('./bill/index.jsx'))
// console.log('CLIENT_BILL', CLIENT_BILL)

const module = {
    CLIENT_STATISTICS: {
        component: CLIENT_STATISTICS,
        name: '业务统计'
    },
    CLIENT_BILL: {
        component: CLIENT_BILL,
        name: '客户账单'
    }
}

export default module
