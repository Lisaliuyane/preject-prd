import load from '@src/views/layout/modules_load'

const HOME = load(() => import('./home.jsx'))

let module = {
    HOME: {
        component: HOME,
        name: '首页'
    }
}

export default module