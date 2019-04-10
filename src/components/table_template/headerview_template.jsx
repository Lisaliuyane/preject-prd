import React, { Component, Fragment } from 'react'
import { Input, Icon} from 'antd';
import { isArray } from '@src/utils'
import { inject, observer } from "mobx-react"
import PropTypes from 'prop-types'
import './headerview_template.less'

const Search = Input.Search;

const style = {width: 130, paddingRight: 10, marginBottom: 10}
const ActionButton = props => {
    return  (
        <div style={{...style, ...props.style}}>
            {
                props.children
            }
        </div>
    )
}
   

/**
 * 表格模板头部
 * 
 * @class HeaderView
 * @extends {Component}
 */
@inject('mobxBaseData')
@observer
class HeaderView extends Component {

    /**
     *  propTypes
     *  props.children 子元素
     *  props.onChangeSearchValue(data, callback(set loading status)) 点击搜索时调用
     * 
     * @static
     * 
     * @memberOf HeaderView
     */
    static propTypes = {
        onChangeSearchValue: PropTypes.func,
        isNoneSearch: PropTypes.bool,  //是否显示头部关键字搜索框,默认显示
        titleBar: PropTypes.element, //头部标题,默认null
        style: PropTypes.object, //style样式
        customClass: PropTypes.string, //自定义className
    }

    static defaultProps = {
        isNoneSearch: false,
        titleBar: null,
        style: {},
        customClass: ''
    }
    
    state = {
        data: [],
        value: [],
        loading: false,
        keyword: '',
        show: false
    }

    onFocus = () => {
        // console.log('onFocus')
    }

    onChangeValue = (d) => {
        // console.log('onChangeValue', d)
        this.setState(d, () => {
            if (this.props.onChangeSearchValue) {
                this.props.onChangeSearchValue(d.keyword,() => {
                        this.setState({loading: false})
                    }
                )
            }
        })
    }

    isShow = () => {
        this.setState({
            show: !this.state.show
        })
    }

    render() {
        const {customClass, mobxBaseData, children} = this.props
        let { show } = this.state
        let pageWidth = mobxBaseData.pageWidth-180
        let size = Math.floor(pageWidth / 130)
        let ratio = children && children.length > size
        if(ratio) {
            this.filterBtn = children.slice(0, size - 2) // 第一行过滤项
            this.moreBtn = children.slice(size - 2) //更多过滤项
        } else {
            this.filterBtn = children
            this.moreBtn = []
        }
        return (
            <div style={Object.assign({ padding: '0px 10px 0 10px' }, this.props.style ? this.props.style : {})}>
                <div className={`flex ${customClass ? customClass : ''}`}>
                    {
                        this.props.titleBar ?
                        this.props.titleBar
                        :
                        <Fragment>
                            <div className='flex' style={{flexWrap: 'wrap'}}>
                                {
                                    isArray(this.filterBtn) ?
                                    this.filterBtn.filter(item => item).map((view, index) => {
                                        let style = view.props && view.props.style ? view.props.style : {}
                                        return (
                                            <ActionButton style={style} length={this.filterBtn.length} key={index}>
                                                {
                                                    view
                                                }
                                            </ActionButton>
                                        )
                                    })
                                    :
                                    <ActionButton style={this.filterBtn && this.filterBtn.props && this.filterBtn.props.style ? this.filterBtn.props.style : {}} length={1}>
                                        {this.filterBtn}
                                    </ActionButton>
                                }
                            </div>
                            {
                                ratio ?
                                <div 
                                    style={{borderBottom: show ? '0' : '1px solid #d9d9d9', height: show ? 42 : 32, marginBottom: !show ? 10 : 0}}
                                    onClick={this.isShow}
                                    className="btn-wrapper"
                                >
                                    更多
                                    <Icon type="down" theme="outlined" style={{marginfontSize: '12px', color: 'rgba(0, 0, 0, 0.25)', transition: 'all 0.5s', transform: show ? 'rotate(-180deg)' : ''}}/>
                                    <div className={show ? 'btn-mask' : ''}></div>
                                </div>
                                :
                                null
                            }
                        </Fragment>
                    }
                    <div className="flex1"></div>
                    {
                        !this.props.isNoneSearch &&
                        <div style={{ width: 160 }} className={this.props.className}>
                            <Search
                                placeholder={this.props.title ? this.props.title : "输入关键字搜索"}
                                onSearch={value => { this.onChangeValue({ keyword: value }) }}
                                //enterButton
                            />
                        </div>
                    }
                </div>
                <div className="btn-main" style={{ display: show && this.moreBtn.length > 0 ? 'block' : 'none'}}>
                    <div className='flex' style={{flexWrap: 'wrap'}}>
                        {
                            isArray(this.moreBtn) ?
                            this.moreBtn.filter(item => item).map((view, index) => {
                                let style = view.props && view.props.style ? view.props.style : {}
                                return (
                                    <ActionButton style={style} length={this.moreBtn.length} key={index}>
                                        {
                                            view
                                        }
                                    </ActionButton>
                                )
                            })
                            :
                            <ActionButton style={this.moreBtn && this.moreBtn.props && this.moreBtn.props.style ? this.moreBtn.props.style : {}} length={1}>
                                {this.moreBtn}
                            </ActionButton>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

HeaderView.ActionButton = ActionButton

export default HeaderView
