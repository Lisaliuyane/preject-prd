import { Component } from 'react'

export default class BasicView extends Component {

    /**
     * Creates an instance of BasicView.
     * 
     * 模块页面 返回本模块对象 方便mobxTabsData中调用页面刷新
     * @param {any} props 
     * 
     * @memberOf BasicView
     */
    
    /**
     * 非当前激活页面 数据更新 页面不更新
     * 
     * @param {any} nextProps 
     * @returns 
     * 
     * @memberOf BasicData
     */
    shouldComponentUpdate(nextProps) {
        if (nextProps.mykey && nextProps.activeKey) {
            // console.log('shouldComponentUpdate', nextProps.mykey === nextProps.activeKey)
            return nextProps.mykey === nextProps.activeKey
        } else {
            return true
        }
    }

    // refresh = () => {
    //     this.setState({data: []}, () => {
    //         this.initData()
    //     })
    // }

    // componentWillMount() {
    //     console.log('BasicView componentWillMount')
    //     let { mobxTabsData, index, mykey } = this.props
    //     mobxTabsData.updateComponent({index: index, key: mykey}, this)
    // }

    // componentDidMount() {
    // }

    // render() {
    //     return (
    //         <div>
    //         </div>
    //     )
    // }
}