import React, { Component } from 'react'
import { Radio } from 'antd'
import RoutePlan from './RoutePlan.jsx'

const { Group, Button } = Radio

export default class TrackMap extends Component {
    constructor (props) {
        super(props)
        this.state = {
            curMap: 'stowage'
        }
    }

    // 切换地图显示
    changeMap = e => {
        let curMap = e ? e.target.value : 'stowage'
        this.setState({ curMap })
    }

    render () {
        const { style, data } = this.props
        let { curMap } = this.state
        return (
            <div style={style}>
                <div style={{height: 50, display: 'flex', alignItems: 'center'}}>
                    <Group
                        value={curMap}
                        buttonStyle="solid"
                        onChange={this.changeMap}
                    >
                        <Button value='stowage'>配载热力图</Button>
                        <Button value='plan'>导航规划</Button>
                        <Button value='real'>实时导航</Button>
                    </Group>
                </div>
                <div style={{width: '100%'}} >
                    {
                        curMap === 'stowage' ?
                        <RoutePlan data={data} type={1} />
                        :
                        curMap === 'real' ?
                        <RoutePlan data={data} type={2} />
                        :
                        curMap === 'plan' ?
                        <RoutePlan data={data} type={3} />
                        :
                        <RoutePlan data={data} type={1} />
                    }
                </div>
            </div>
        )
    }
}