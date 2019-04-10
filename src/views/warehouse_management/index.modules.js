import load from '@src/views/layout/modules_load'

const RES_DEMAND = load(() =>
  import('./receipt/demand'))
const RES_MANAGE = load(() =>
  import('./receipt/manage'))
const RES_ORDER = load(() =>
  import('./receipt/order'))

const module = {
  RES_DEMAND: {
    component: RES_DEMAND,
    name: '收货需求'
  },
  RES_MANAGE: {
    component: RES_MANAGE,
    name: '收货管理'
  },
  RES_ORDER: {
    component: RES_ORDER,
    name: '订单管理'
  }
}

export default module
