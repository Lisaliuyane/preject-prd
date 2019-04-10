import Loading from './loadview'
import Loadable from '@src/components/react-loadable'
// import Loadable from 'react-loadable'
import React from 'react'

// const Loadable = require('@src/components/react-loadable')

export default (loader) => {

    const loadable = Loadable({
        loader: loader,
        loading: (props) => <Loading loader={loader} {...props} loadable={loadable} />,
        delay: 300,
        timeout: 60000
    })
    return loadable
}