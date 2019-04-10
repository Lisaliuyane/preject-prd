import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { List, Card } from 'antd'
import MODULEDEFINE from '@src/views/MODULEDEFINE.js'


@inject('mobxTabsData')
@observer
class Home extends Component {

    state = {
        data: []
    }

    constructor(props) {
        super(props)
        for (let key in MODULEDEFINE) {
            this.state.data.push({
                key: key,
                name: MODULEDEFINE[key].name
            })
        }
    }

    pushNewTab(e) {
        const mobxTabsData = this.props.mobxTabsData
        if (e.key !== 'HOME') {
            mobxTabsData.pushNewTabs({
                component: e.key,
                key: e.key
            })
        }
    }

    render() {
        // console.log('MODULEDEFINE', MODULEDEFINE)
        let { minHeight } = this.props
        const data = this.state.data
        return (
            <div  style={{minHeight: minHeight, padding: '20px 20px 0'}}>
            {
                process.env.NODE_ENV === 'development' ?
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item onClick={() => this.pushNewTab(item)}>
                            <Card title={item.name}>
                                {`这是模块${item.name}, 点击进入`}
                            </Card>
                        </List.Item>
                    )}
                />
                :
                null
            }
               {
                //     <Card
                //     className="paper-1"
                //     style={{ width: 300, border: 0 }}
                //     cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                //     actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                // >
                //     <Meta
                //         avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                //         title="项目名称"
                //         description="This is the description"
                //         />
                // </Card>
               }
            </div>
        )
    }
}
 
export default Home;