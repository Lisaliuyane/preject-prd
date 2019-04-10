import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
/**
 * 客户管理业务统计
 * 
 * @class ClientStatistics
 * @extends {Component}
 */
@inject('mobxTabsData')
@observer
class ClientStatistics extends Component {
    state = {}
    render() { 
        return (  
            <div>
                {'业务统计'}
            </div>
        )
    }
}
 
export default ClientStatistics;