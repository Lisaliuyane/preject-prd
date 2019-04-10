import React from 'react'
import ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd'
import App from './App'
import './index.css'
import './libs/css/public.less'
import zhCN from 'antd/lib/locale-provider/zh_CN' // 初始化 antd为中文
import moment from 'moment'
import momentLocale from 'moment/locale/zh-cn.js' // 初始化 moment 语言为中文

import registerServiceWorker from './registerServiceWorker'
// moment.lang('zh-cn', momentLocale)
moment.locale('zh-cn')
// console.log('moment', moment, momentLocale)

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
    <App />
    </LocaleProvider>, 
    document.getElementById('root')
);
registerServiceWorker();
