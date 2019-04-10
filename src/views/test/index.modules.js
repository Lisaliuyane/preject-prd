import load from '@src/views/layout/modules_load'
const CLIENT_DEMO = load(() => import('./source_demo'))
// const CLIENT_TEXT = load(() => import('./source_test'))

const module = {
    CLIENT_DEMO: {
        component: CLIENT_DEMO,
        name: '测试demo'
    },
    // CLIENT_TEXT: {
    //     component: CLIENT_TEXT,
    //     name: 'select组件'
    // }
}

export default module
