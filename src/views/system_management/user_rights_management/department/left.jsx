import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Menu, Button, Icon, Input, message, Tree, Popconfirm  } from 'antd'
import AddOrEdit from './addoredit'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import './index.less'

const SubMenu = Menu.SubMenu
const TreeNode = Tree.TreeNode
const Search = Input.Search

// @inject('mobxWordBook')
const MAXDEPTH = 4

const TreeContent = (props) => {
    const { power, grade, data, onAdd, onEdit, onDelete } = props
    const wrapperWidth = (235 - 18 * (grade - 1)) + 'px'
    return (
        <div className="flex" style={Object.assign({}, { width: wrapperWidth }, props.slc ? { color: 'red'} : {})}>
            <div className="flex1">
                {props.title}
            </div>
            <div className="flex1"></div>
            <div onClick={e => e.stopPropagation()} style={{display: 'table'}}>
                {
                    grade >= MAXDEPTH ? 
                    null 
                    :
                    <FunctionPower power={power.ADD_DATA}>
                        <div onClick={e => onAdd(data, e)} style={{display: 'table-cell', textAlign: 'center'}}>
                            <Icon type="plus" style={{color: '#1DA57A', padding: '5px 5px'}} />
                        </div>
                    </FunctionPower>
                }
                {/* <div onClick={e => onEdit(data, e)} style={{display: 'table-cell', width: 24}}>
                    <Icon type="edit" style={{color: '#1DA57A'}} />
                </div> */}
                <div style={{display: 'table-cell'}}>
                    <FunctionPower power={power.DEL_DATA}>
                        <Popconfirm
                                title={`确定要删除所有选中项?`}
                                onConfirm={e => onDelete(data)}
                                okText="确定"
                                cancelText="取消"
                            >
                            <Icon type="delete" style={{color: 'red', padding: '5px 5px'}} />
                        </Popconfirm>
                    </FunctionPower>
                </div>
            </div>
        </div>
    )
}
  
@inject('rApi')
class LeftView extends Component {
    state = {
        navList: [], //部门数据列表
        openKeys: [],
        rootSubmenuKeys: [],
        expandedKeys: [], //展开指定的树节点
        searchValue: '', //搜索值
        selectedKeys: [], //选中值
        autoExpandParent: false, //是否自动展开父节点
        showTree: true, //显示tree菜单
    }
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        // this.initData(props)
    }
    componentDidMount() {
        this.initData()
    }

    initData = (key, keyData) => {
        this.props.rApi.getOrganization().then((res) => {
           //console.log('getOrganization', res)
            if(res && res.length>0) {
                this.setState({
                    navList: res,
                    rootSubmenuKeys: res.map((item) => {
                        return item.title
                    })
                })
                let sKey = key || [res[0].id.toString()]
                let sKeyData = keyData || res[0]
                this.onSelect(sKey, sKeyData)
            }

        }).catch()
    }

    // 关键字搜索
    findKey (title, list, rtArr) {
        let rt = [...rtArr]
        list.forEach(item => {
            if (item.title.indexOf(title) > -1 && title !== '' && title !== null) {
                if (!rt.some(k => k === item.id)) {
                    rt.push(item.id)
                }
            }
            if (item.subs && item.subs.length) {
                this.findKey(title, item.subs, rt).forEach(kid => {
                    if (!rt.some(k => k === kid)) {
                        rt.push(kid)
                    }
                })
            }
        })
        return rt
    }

    // 设置符合当前搜索项
    slcNavList (list, keysArr) {
        return list.map(item => {
            if (keysArr.some(k => k === item.id)) {
                item.slc = true
            } else {
                delete item.slc
            }
            if (item.subs) {
                this.slcNavList(item.subs, keysArr)
            }
            return item
        })
    }

    // 关键词过滤展开
    onChange = async (e) => {
        let { navList } = this.state
        const titleVal = e.target.value
        let expandedKeys = []
        expandedKeys = this.findKey(titleVal, navList, [])
        // console.log('expandedKeys', expandedKeys)
        navList = this.slcNavList(navList, expandedKeys)
        // console.log('navlist', navList)
        await this.setState({
            navList,
            expandedKeys,
            searchValue: titleVal,
            autoExpandParent: true,
            showTree: false
        })
        this.setState({showTree: true})
    }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        })
    }

    onSelect = (sKeys, info) => {
        // console.log('sKeys', sKeys)
        if (sKeys.length > 0) {
            this.setState({ selectedKeys: sKeys })
            let selectedData = (info.selectedNodes && info.selectedNodes.length > 0) ?
                info.selectedNodes[0].props.title.props.data : info
            this.props.selectedOrigeData(selectedData) //选中的部门数据通过index传给RightView组件
        }
    }

    addItem = (data = null) => {
        this.addoredit.show({
            edit: false,
            title: '新建部门 ' ,
            addData: data //要添加下属部门的数据
        })
    }

    onAdd = (data, e) => {
        //console.log('onAdd', data)
        let d = data ? data : ''
        this.addItem(d)
        
    }

    onDelete = (data) => {
        let delId = data ? JSON.parse(data.id) : ''
        this.props.rApi.delOrganization({
            id: delId
        }).then(d => {
            this.initData()
        })
    }

    treeNode = (preitem, i) => {
        i++
        return (
            <TreeNode title={
                <TreeContent power={this.props.power} onAdd={this.onAdd} onDelete={this.onDelete} data={preitem} grade={i} title={preitem.title} slc={preitem.slc ? preitem.slc : false} />
            } key={preitem.id} >
                {
                    preitem.subs && preitem.subs.length > 0 ? 
                    preitem.subs.map(item => {
                        return this.treeNode(item, i)
                    })
                    :
                    null
                }
            </TreeNode>
        )
    }


    reRequest = () => { //添加部门成功后重新请求数据
        this.initData()
    }
    render() { 
        let { 
            navList, 
            selectedKeys, 
            expandedKeys, 
            autoExpandParent,
            showTree
        } = this.state
        let { power } = this.props
        return (
            <div className="left_nav_wrapper" style={{marginRight: 25}}>
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                    reRequest={this.reRequest}
                />
                <div className="nav_header" style={{width: 299, height: 65, background: '#fff'}}>
                    <div className="nav_top" style={{height: 48, borderBottom: '1px solid #666', padding: '8px 0 8px 15px'}}>
                        <span style={{color: '#ccc', lineHeight: '32px' }}>部门列表</span>
                        <FunctionPower power={power.ADD_DATA}>
                            <Button onClick={e => this.addItem(null)} style={{ marginRight: 10, float: 'right' }}>
                                <Icon type="plus" />新建
                            </Button>
                        </FunctionPower>
                    </div>
                </div>
                <div style={{background: '#fff', minHeight: 300, padding: '10px 15px'}}>
                    <Search 
                        style={{ marginBottom: 8 }} 
                        placeholder="关键字搜索" 
                        onChange={this.onChange} />
                    {
                        showTree &&
                        <Tree
                            selectedKeys={selectedKeys}
                            onSelect={this.onSelect}
                            onExpand={this.onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                        >
                            {
                                navList.map(preitem => {
                                    return this.treeNode(preitem, 0)
                                })
                            }
                        </Tree>
                    }
                </div>
            </div>
        )
    }
}
 
export default LeftView;
