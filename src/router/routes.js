// import React, { Component } from 'react';
// import Loadable from 'react-loadable';
import Home from '../views/layout'
/**
 * route定义、组件异步加载 模块
 */
// class Loading extends Component {
//     render() {
//         return <div>Loading...</div>;
//     }
// }
// const Home = Loadable({
//     loader: () => import('../views/layout'),
//     loading: Loading,
// })

const routes = [
    {
        path: '/',
        name: '主页',
        icon: 'home',
        component: Home
    }
    // {
    //     path: '/v2',
    //     name: '主页2',
    //     icon: 'home',
    //     component: V2
    // },
    // {
    //     path: '/v3',
    //     name: '主页3',
    //     icon: 'home',
    //     component: V3
    // },
    // {
    //     path: '/v4',
    //     name: '主页4',
    //     icon: 'home',
    //     component: V4
    // }
]
export default routes