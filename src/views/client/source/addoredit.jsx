import React, { Component } from 'react'
import moment from 'moment'
import Modal from '@src/components/modular_window'
import { Button, Form, Input, Checkbox, message } from 'antd'
import FormItem from '@src/components/FormItem'
import { SelectAddress } from '@src/components/select_address'
import { Row, Col } from '@src/components/grid'
import { dateSelectData, likeIdToName } from './date_select_data'
import { inject, observer } from "mobx-react"
import { isArray, addressToString, cloneObject, validateNumberAndText } from '@src/utils'
import Contacts from './contacts'
import LegalPeron from './legalperon'
import RemoteSelect from '@src/components/select_databook'
import SelectMulti from '@src/components/select_multi'
import './addoredit.less'

let scopesIdToTitle = {}
let scopesTitleToId = {}
// const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

const isNull = (vari) => {
    // console.log('vari && vari.toString().length > 0', vari && vari.toString().length > 0, vari)
    if (vari && vari.toString().length > 0) {
        return false
    }
    return true
}

const defaultCheckedList = [
    {
        id: 1, 
        title: '汽运'
    },
    {   id: 2, 
        title: '空运'
    },
    {   id: 3, 
        title: '铁运'
    },
    {   id: 4, 
        title: '海运'
    },
    {   id: 5, 
        title: '仓储'
    }
]

@inject('rApi')
@inject('mobxWordBook')
@observer
class AddOrEdit extends Component {

    state = {
        open: false,
        edit: false,
        type: null,
        title: null,
        scopes: [], // 业务范围
        scopesData: [], //业务范围数据
        defaultScopes: [], //业务默认值
        shortname: null, // 客户名称
        username: null, // 客户全称
        code: null, // 客户代码
        userclass: null, // 客户行业
        address: {}, // 地址
        area: [], // 所属区域
        parent: {}, // 所属母公司
        salesman: {}, // 业务代表
        legal: {}, // 接单法人
        labels: [],
        labelsData: [], //客户标签数据
        status: null, // 合作状态
        period: null,
        ifShow: true,
        buttonLoading: false,
        identificationNumber: null, //证件号码
        historyData: null // 传入数据
    }
    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        this.state.open = false
        // console.log('carcode',this.state.carcode)
    }

    componentDidMount() {
        if (this.props.getThis) {
            this.props.getThis(this)
        }
        let { mobxWordBook } = this.props
        // let { legalpersons } = mobxWordBook
        mobxWordBook.initLegalPersons()
        this.setState({scopesData: defaultCheckedList.map((item) => {
            scopesIdToTitle[item.id] = item.title
            scopesTitleToId[item.title] = item.id
            let obj = {id: item.id, label: item.title, value: item.id}
            return obj
        })})
    }

    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    show(d) {
       // console.log('show编辑', d.data)
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        if (d.edit) {
            d.data = Object.assign({}, d.data, {
                type: 1,
                title:'编辑客户',
                labelsData: d.data.labels ? d.data.labels : [],
                defaultScopes: d.data && isArray(d.data.scopes) ? d.data.scopes : [],
                ifShow: true
            })
        } else if (d.data) {
            d.data = Object.assign({}, d.data, {
                type: 2,
                title:'查看客户',
                labelsData: d.data.labels ? d.data.labels : [],
                defaultScopes: d.data && isArray(d.data.scopes) ? d.data.scopes : [],
                ifShow: false
            })
        } else {
            // this.setState()
            d.data = {
                type: 3,
                title:'新建客户',
                ifShow: true
            }
            //console.log('新建')
        }
        this.setState({
            ...Object.assign({}, d.data),
            historyData: historyData,
            open: true,
            edit: d.edit
        })
    }
    actionDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        this.changeOpen(false)
        message.success('操作成功！')
    }

    clearValue() {
        this.setState({
            title: null,
            scopes: [], // 业务范围
            shortname: null, // 客户名称
            username: null, // 客户全称
            code: null, // 客户代码
            userclass: null, // 客户行业
            address: {}, // 地址
            area: [], // 所属区域
            parent: {}, // 所属母公司
            salesman: {}, // 业务代表
            legal: {}, // 接单法人
            labels: [], // 标签
            labelsData: [], //客户标签数据
            status: null, // 合作状态
            period: null,
            contacts: [],
            legals: [],
            ifShow: true,
            buttonLoading: false
        })
    }

    // onSubmit = () => {
    //     alert('xxx')
    // }

    onChange = (value, selectedOptions) => {
        // console.log(value, selectedOptions);
    }

    onChangeScopeOfBusiness = (value) => {
        // console.log('onChangeScopeOfBusiness', value)
        // this.setState({
        //     scopes: value
        // })
        this.setState({scopes: value.map(item => {
            return {
                id: item,
                title: scopesIdToTitle[item]
            }
        })
        })
    }

    saveSubmit = () => {
        let legals = this.refs.legalperon.logData()
        let contacts = this.contacts.logData()
        let address = this.selectAddress.getValue()
        let { 
            period,
            edit,
            scopes, 
            shortname, 
            username, 
            code, 
            userclass, 
            area,
            parent, 
            legal,
            status,
            salesman,
            labels,
            identificationNumber
        } = this.state

        if (!area || area.id === 0) area = null
        salesman = salesman && salesman.id ? salesman : null
        // parent = parent && parent.id ? parent.id : null 
        if(!address || !address.pro || address.pro.pro === '') {
            message.error('请选择公司地址')
            return false
        }
        if(legals && legals.length < 1) {
            message.error('请填写客户法人！')
            return false
        }
        let { rApi } = this.props

        if(this.state.type === 1) {
            this.setState({
                buttonLoading: true
            })
            rApi.editClient({
                ...this.state, ...{
                    scopes, 
                    shortname, 
                    username, 
                    code, 
                    userclass, 
                    address,
                    area, 
                    parent, 
                    legal,
                    legals,
                    status,
                    contacts,
                    salesman,
                    period,
                    identificationNumber
                }
            }).then(e => {
                message.success('操作成功!')
                this.changeOpen(false)
                this.setState({
                    buttonLoading: false
                }, () => {
                    this.updateThisDataToTable({
                        scopes, 
                        shortname, 
                        username, 
                        code, 
                        userclass, 
                        address,
                        area, 
                        parent, 
                        legal,
                        legals,
                        status,
                        contacts,
                        salesman,
                        period,
                        identificationNumber
                    })
                })
                // this.actionDone()
            }).catch(e => {
                if (e.errorMessage === `duplicate key value violates unique constraint "frd_client_name_key"`) {
                    message.error('客户名与已创建的客户名重复！')
                    this.setState({
                        buttonLoading: false
                    })
                } else {
                    message.error(e.errorMessage || '操作失败！')
                    this.setState({
                        buttonLoading: false
                    })
                }
            })
        } else if(this.state.type === 2) {
            this.changeOpen(false)
        } else if(this.state.type === 3) {
            this.setState({
                buttonLoading: true
            })
            rApi.createClient({ 
                labels,
                scopes, 
                shortname, 
                username, 
                code, 
                userclass, 
                address,
                area, 
                parent, 
                legal,
                legals,
                status,
                contacts,
                salesman,
                period,
                identificationNumber
            }).then(res => {
                this.setState({
                    buttonLoading: false
                })
                this.actionDone()
            }).catch(e => {
                if (e.errorMessage === `duplicate key value violates unique constraint "frd_client_name_key"`) {
                    message.error('客户名与已创建的客户名重复！')
                    this.setState({
                        buttonLoading: false
                    })
                } else {
                    message.error(e.errorMessage || '操作失败！')
                    this.setState({
                        buttonLoading: false
                    })
                }
            })
        }
    }

    onSubmit = () => {
        // e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            //console.log('Received values of form: ', values);
            this.saveSubmit()
          }
        });
    }

    /**
     * status = 1 // {status: this.state.status}
     * 
     * @memberof AddOrEdit
     */
    updateThisDataToTable = (d) => {
        let { historyData } = this.state
        const { parent } = this.props
        if (!historyData) return
        if (parent && parent.tableView)
        parent.tableView.updateData(Object.assign({}, historyData, d))
    }

    onChageProvince = (value) => {
        let { rApi } = this.props
        // console.log('onChageProvince', value)
        if (value && value.id) {
            rApi.getAreaByAddress(value).then(res => {
                this.setState({area: res || []})
            })
        } else {
            this.setState({area: []})
        }
    }

    handleChangeTag = (value) => { //承运商标签
        this.setState({labels : value.map((item) => {
            let obj = {id: item.id, title: item.title}
            return obj
        })})
    }

    ChangeShortName  = (e) => {
        let { rApi } = this.props
        let value = e.target.value
        this.setState({shortname: value})
        //this.props.form.setFieldsValue({shortname: value})
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            if (value) {
                rApi.gencode({keyword: value}).then(res => {
                    // console.log('keyword', res)
                    this.setState({code: res})
                })
            }
        }, 100)
    }

    getUsersData = () => { //获取业务代表数据
        let { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi.getUsers({
                limit: 999999, 
                offset: 0
            }).then(d => {
                //console.log('filterOrderIdGetCarType', d)
                let data = d.list
                if(data && data.length > 0) {
                    resolve(data.map(item => {
                        return { ...item, name: item.username}
                    }))
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
       
    }

    getSelectAddress = (d) => {
        this.selectAddress = d
    }

    fieldStatusData(d) { //过滤合作状态数据
        let obj = d && d.length > 0 ? d.filter(d => d.id !== 153) : []
        return obj
    }

    render() { 
        let { dataSource, mobxWordBook } = this.props
        // let { legalpersons } = mobxWordBook
        // mobxWordBook.initLegalPersons()
        let { open, edit } = this.state
        if (!open) return null
        let { 
            type,
            title,
            legals,
            contacts,
            period,
            scopes, 
            scopesData,
            shortname, 
            username, 
            code, 
            userclass, 
            address,
            area,
            parent, 
            legal,
            status,
            labels,
            labelsData,
            salesman,
            defaultScopes,
            ifShow,
            buttonLoading,
            identificationNumber
        } = this.state
        // console.log('period', period)
        const { getFieldDecorator, setFieldsValue } = this.props.form
        return (
            <Modal
                onSubmit={this.onSubmit}
                style={{width: '100%', maxWidth: 850, minHeight: 300}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                haveFooter={type === 2 ? false : true}
                footerText="保存"
                loading={buttonLoading}
                getContentDom={v => this.popupContainer = v}
                >
                <div style={{minHeight: 272}} className="client-wrapper">
                    <Form layout='inline'>
                        {/* <Modal.Header title={'基本信息'}>
                            {
                                ifShow === true ?
                                <FormItem> 
                                    <Button 
                                        //icon='save' 
                                        htmlType="submit" 
                                        style={{ marginRight: 0, color: '#fff', background: '#18B583', border: 0}}
                                        loading={buttonLoading}
                                    >
                                        保存
                                    </Button>
                                </FormItem>
                                :
                                ''
                            }
                        </Modal.Header> */}
                        <div style={{padding: '5px 20px', margin: 'auto'}}>
                        <Row gutter={24} type={type}>
                            <Col isRequired  label="客户全称&emsp;&emsp;" colon span={9} text={username}>
                                <FormItem>
                                {
                                    getFieldDecorator('userName', {
                                        initialValue: username,
                                        rules: [
                                            { 
                                                required: true, 
                                                message: '请填写客户名称'
                                            }
                                        ],
                                    })(
                                        <Input 
                                            onChange={e => {
                                                this.setState({username: e.target.value})
                                            }}
                                            placeholder="" 
                                        />
                                    )
                                }
                                </FormItem>
                            </Col>
                            <Col label="客户代码&emsp;&emsp;" colon span={8} text={code}>
                                <Input 
                                    disabled 
                                    value={code ? code : ''} 
                                    placeholder="" />
                            </Col>
                            <Col span={4} />
                        </Row>
                        <Row gutter={24} type={type}>
                            <Col isRequired label="客户简称&emsp;&emsp;" colon span={9} text={shortname}>
                                <FormItem>
                                    {
                                        getFieldDecorator('shortname', {
                                            initialValue: shortname,
                                            rules: [{ required: true, 
                                                message: '请填写客户简称'
                                            }],
                                        })(
                                            <Input 
                                                onChange={this.ChangeShortName}
                                                placeholder="" 
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col label="所属母公司&emsp;" colon span={8} text={parent && parent.shortname ? parent.shortname : '无'}>
                                <RemoteSelect 
                                    defaultValue={parent}
                                    getPopupContainer={() => this.popupContainer || document.body}
                                    onChangeValue={value => this.setState({parent: value})}
                                    dataKey={'clients'}
                                    labelField='shortname'
                                    getDataMethod={'getClients'}
                                    params={{offset: 0, limit: 1000}}
                                />
                            </Col>
                            <Col span={4} />
                        </Row>
                        <Row gutter={24} type={type}>
                            <Col isRequired label="客户行业&emsp;&emsp;" colon span={9} text={userclass && userclass.title ? userclass.title : '无'}>
                                <FormItem>
                                    {
                                        getFieldDecorator('userclass', {
                                            initialValue: userclass ? userclass : null,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请选择客户行业'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect 
                                                defaultValue={userclass ? userclass : null}
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                onChangeValue={value => {
                                                    this.setState({userclass: value})
                                                    //setFieldsValue({userclass: value})
                                                }
                                            }
                                                text="客户行业" 
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            {/* <Col label="业务范围" contentStyle={{whiteSpace: 'normal'}} span={17} text={defaultScopes ? defaultScopes.map(item => item.title).join(', ') : null}>
                                <CheckboxGroup 
                                    defaultValue={defaultScopes ? defaultScopes.map(item => item.id) : []}
                                    options={scopesData} 
                                    // value={scopes} 
                                    onChange={this.onChangeScopeOfBusiness} />
                            </Col> */}
                        </Row>
                        <Row gutter={24} type={type}>
                            <Col isRequired span={18} label="公司地址&emsp;&emsp;" colon span={18} text={addressToString(address)}>
                                <SelectAddress 
                                    onChageProvince={this.onChageProvince}
                                    getPopupContainer={() => this.popupContainer || document.body}
                                    address={address}
                                    getThis={this.getSelectAddress} 
                                    defaultValue={null} 
                                    title={addressToString(address)}
                                    />
                            </Col>
                            <Col isRequired offset={1} label="所属片区&emsp;" colon span={5} text={area && area.length > 0 ? area.map(item => item.title).join(', ') : '无'}>
                                {/* <Input 
                                    disabled 
                                    value={area ? area.title : ''}  /> */}
                                    <Input 
                                        disabled 
                                        placeholder="自动识别"
                                        value={area && area.length > 0 ? area.map(item => item.title).join(',') : '无'} 
                                        title={area && area.length > 0 ? area.map(item => item.title).join(',') : '无'}
                                    />
                            </Col>
                        </Row>
                        <Row gutter={24} type={type}>
                            <Col span={9} label="证件号码&emsp;&emsp;" colon span={9} text={identificationNumber || '无'}>
                                <FormItem>
                                    {
                                        getFieldDecorator('identificationNumber', {
                                            initialValue: identificationNumber,
                                            rules: [
                                                { 
                                                    validator: validateNumberAndText
                                                }
                                            ],
                                        })(
                                            <Input 
                                               // value={identificationNumber || ''}
                                                onChange={(e) => {
                                                    this.setState({
                                                        identificationNumber: e.target.value
                                                    })
                                                }}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <div className="base-text">合作信息</div>
                        <Row gutter={24} type={type}>
                            {/* <Col label="业务代表" span={6}>
                                <RemoteSelect 
                                    defaultValue={salesman}
                                    onChangeValue={value => this.setState({salesman: value})}
                                    text="业务代表" />
                            </Col> */}
                            <Col isRequired label="业务代表&emsp;&emsp;" colon span={9} text={salesman && salesman.name ? salesman.name : '无'}>
                                <FormItem>
                                {
                                    getFieldDecorator('salesman', {
                                        //initialValue: salesman,
                                        rules: [
                                            { 
                                                required: true, 
                                                message: '请填写业务代表'
                                            }
                                        ],
                                    })(
                                        <RemoteSelect
                                            defaultValue={salesman}
                                            getPopupContainer={() => this.popupContainer || document.body}
                                            onChangeValue={
                                                value => {
                                                    this.setState({
                                                        salesman: value
                                                    })
                                                }
                                            } 
                                            getData={this.getUsersData}
                                            //params={{limit: 999999, offset: 0}}
                                            labelField={'name'}
                                        />
                                    )
                                }
                                </FormItem>
                            </Col>
                            <Col span={10} />
                        </Row>
                        <Row gutter={24} type={type}>
                            <Col 
                                isRequired
                                span={9}
                                label="合作状态&emsp;&emsp;" 
                                colon
                                text={status && status.title ? status.title : '无'}
                            >
                                <FormItem>
                                    {
                                        getFieldDecorator('status', {
                                            initialValue: status ? status : null,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请选择合作状态'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                defaultValue={status ? status : null} 
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                onChangeValue={value => {
                                                    this.setState({status: value})
                                                }}
                                                text="合作状态" 
                                                dealData={this.fieldStatusData}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24} type={type}>
                            <Col 
                                span={9}
                                label="对账周期&emsp;&emsp;" 
                                colon
                                isRequired
                                text={period ? likeIdToName(period) : null}
                            >
                                <FormItem>
                                    {
                                        getFieldDecorator('period', {
                                           // initialValue: period ? period : null,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请选择对账周期'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect 
                                                defaultValue={period ? {id: period, name: likeIdToName(period)} : null}
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                onChangeValue={value => {
                                                    if(value && value !== ''){
                                                        this.setState({period: value.id})
                                                    }
                                                }}
                                                labelField='name'
                                                list={dateSelectData()}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <span>~</span>
                            <Col span={5}>
                                <Input 
                                    value={period && period === -1 ? '自然月' : period && period === 1 ? '30号' : period ? `次月${likeIdToName(period-1)}` : '无'}
                                    disabled
                                />
                            </Col>
                            <Col span={9}/>
                        </Row>
                        <Row gutter={24} type={type}>
                            <Col 
                                span={9}
                                label="接单法人&emsp;&emsp;" 
                                colon
                                isRequired
                                text={legal && legal.fullName ? legal.fullName : '无'}
                            >
                                <FormItem>
                                    {
                                        getFieldDecorator('legal', {
                                           // initialValue: legal ? legal : null,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请选择接单法人'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                defaultValue={legal}
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                onChangeValue={value => this.setState({legal: value})}
                                                //list={mobxWordBook.legalpersons ? mobxWordBook.legalpersons.slice() : []}
                                                getDataMethod="getLegalPersonList"
                                                params={{offset: 0, limit: 999999}}
                                                labelField='fullName' 
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24} type={type}>
                            <Col 
                                span={24} 
                                label="选择标签&emsp;&emsp;" 
                                colon 
                                text={isArray(labelsData) ? labelsData.map(item => item.title).join(', ') : '无' }>
                                    <SelectMulti
                                        defaultValue= {labelsData ? labelsData : []}
                                        getPopupContainer={() => this.popupContainer || document.body}
                                        text='客户标签' 
                                        handleChangeSelect={this.handleChangeTag}
                                    />
                            </Col>
                        </Row>
                        </div>
                        <div type="flex" justify="space-around" className="contacts-wrapper" style={{padding: '0 20px 10px'}}>
                            <Contacts 
                                data={contacts} 
                                // ref='contacts' 
                                getThis={view => this.contacts = view}
                                type={type}
                            />
                        </div>
                        <div type="flex" justify="space-around" style={{padding: '0 20px 10px'}}>
                            <LegalPeron data={legals} ref='legalperon' type={type} />
                        </div>
                        <FormItem />
                    </Form>
                </div>
            </Modal>
        )
    }
}
 
export default Form.create()(AddOrEdit);