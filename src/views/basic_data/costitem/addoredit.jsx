import React, { Component } from 'react'
import Modal from '@src/components/modular_window'
import { Button, Form, Input, InputNumber, Checkbox, message, Icon, DatePicker, Radio, Switch } from 'antd'
import RemoteSelect from '@src/components/select_databook'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import { inject } from "mobx-react"
import { isArray, cloneObject } from '@src/utils'
import './index.less'

const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group;

let costUsagesIdToTitle = {}
let costUsagesTitleToId = {}
let costUnitIdToTitle = {}
let costUnitTitleToId = {}

const stringToArray = (d) => {
    if (isArray(d)) {
        return d
    }
    if (typeof d === 'string') {
        try {
            let array = JSON.parse(d)
            if (isArray(array)) {
                return array
            }
        } catch (e) {
        }
    }
    return []
}

@inject('rApi')
@inject('mobxDataBook')
class AddRoEdit extends Component {

    state={
        open: true,
        edit: false,
        title: '费用项',
        showtype: null,
        itemId: null,
        code: null, // 费用代码
        name: null, // 费用名称
        typeName: '运输费用', // 费用类型名称
        typeId: 92, // 费用类型id
        uses: [], // 费用用途
        // reimbursement: null, // 实报实销
        billingMethodId: null, //计费方式id
        billingMethodName: null, //计费方式name
        receivableOrPayable: '应收', //应收或者应付
        remark: null, // 备注
        expenseUses: null,
        combackuses: [], 
        combackROrPChangeValue: [],
        unitData: [],
        orignUnitData: [], 
        unitConfigure: [],
        combackUnit: [],
        costTypeList: [], //费用类型数据
        costUsages: [], //费用用途数据
        costUsagesList: [], //保存费用用途数据
        costTypeListToStorage: [], //费用用途仓储数据
        costTypeListToDuties: [], //费用用途关务数据
        receiveOrPayList: [], // 应收应付列表
        receivableOrPayableChangeValue: [], //应收应付改变值
        buttonLoading: false,
        isCl: false,
        historyData: null, // 传入数据
        isMonthlyCalculation: 0 //是否月结
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        this.state.open = false
    }

    componentDidMount() {
       this.getCostUsages()
       this.getBusinessModelData()
       this.getUnitData()
       this.getCostType()
    }

    getCostUsages = () => {
        const { mobxDataBook } = this.props
        mobxDataBook.initData('费用用途').then(data => {
            this.setState({
                // costUsages: data.filter(d => d.title !== '应收' && d.title !== '应付' && d.title !== '仓储' && d.title !== '关务').map((item) => {
                //     costUsagesIdToTitle[item.id] = item.title
                //     costUsagesTitleToId[item.title] = item.id
                //     let obj = {id: item.id, label: item.title, value: item.id}
                //     return obj
                // }),
                receiveOrPayList: data.filter(d => d.title === '应收' || d.title === '应付').map((item) => {
                    costUsagesIdToTitle[item.id] = item.title
                    costUsagesTitleToId[item.title] = item.id
                    let obj = {id: item.id, label: item.title, value: item.id}
                    return obj
                })
        })
        })
    }
    
    
    getBusinessModelData = () => { // 获取业务模式
        const { mobxDataBook } = this.props
        return new Promise((resolve, reject) => {
            mobxDataBook.initData('业务模式').then(d => {
                this.setState({
                    costUsages: d && d.length > 0 ? d.filter(item => (item.title === '零担' || item.title === '整车' || item.title === '快递' || item.title === '整柜' || item.title === '快运')).map(res => {
                        costUsagesIdToTitle[res.id] = res.title
                        costUsagesTitleToId[res.title] = res.id
                        let obj = {id: res.id, label: res.title, value: res.id}
                        return obj
                    }) : []
                })
                resolve(d)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getUnitData = () => { //报价计费方式
        const { mobxDataBook, rApi } = this.props
        rApi.getConfigureTransportUnit({
            unitClassification: this.state.typeName === '仓储费用' ? 2 : 1,
            unitKind: 2
        }).then(data => {
            this.setState({
                unitData: data.map((item) => {
                    costUnitIdToTitle[item.id] = item.title
                    costUnitTitleToId[item.title] = item.id
                    let obj = {id: item.id, label: item.title, value: item.id}
                    return obj
                }),
                orignUnitData: data.map((item) => {
                    costUnitIdToTitle[item.id] = item.title
                    costUnitTitleToId[item.title] = item.id
                    let obj = {id: item.id, label: item.title, value: item.id}
                    return obj
                })
            })
        }).catch(e => {
            console.log(e)
        })
    }

    getCostType = () => {
        const { mobxDataBook } = this.props
        mobxDataBook.initData('费用类型').then(data => {
            //console.log('getCostType', data)
            this.setState({
                costTypeList: data
            })
        })
    }

    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    clearValue = () => {
       this.setState({
        showtype: null,
        itemId: null,
        code: null, // 费用代码
        name: null, // 费用名称
        typeName: '运输费用', // 费用类型名称
        typeId: 92, // 费用类型id
        uses: [], // 费用用途
        // reimbursement: null, // 实报实销
        billingMethodId: null, //计费方式id
        billingMethodName: null, //计费方式name
        remark: null, // 备注
        combackuses: [], 
        combackROrPChangeValue: [],
        expenseUses: null,
        unitConfigure: [],
        combackUnit: [],
        buttonLoading: false,
        receivableOrPayable: '',
        isCl: false,
        isMonthlyCalculation: 0
       })
    }
    show(d) {
       // this.getCostUsages()
       let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        if (d.edit) {
            d.data = Object.assign({}, d.data, {
                showtype: 1, 
                edit: true, 
                title: '编辑费用项', 
                itemId: d.data.id, 
                // reimbursement: d.data.shibaoshixiao,
                combackuses: d.data && isArray( d.data.expenseUses.split(',')) ? 
                    d.data.expenseUses.split(',').map(item => costUsagesTitleToId[item])
                    : 
                    []
                ,
                uses: d.data.expenseUses ? d.data.expenseUses.split(',').map(item => {
                    let obj = {id: costUsagesTitleToId[item], name: item}
                    return obj
                }) : [],
                combackROrPChangeValue: d.data && d.data.receivableOrPayable && isArray( d.data.receivableOrPayable.split(',')) ? 
                d.data.receivableOrPayable.split(',').map(item => costUsagesTitleToId[item])
                : [],
                receivableOrPayableChangeValue: d.data.receivableOrPayable ? d.data.receivableOrPayable.split(',').map(item => {
                    let obj = {id: costUsagesTitleToId[item], name: item}
                    return obj
                }) : [],
                combackUnit: d.data && isArray(d.data.unitConfigureList) ? 
                    d.data.unitConfigureList.map(item => {
                        return item.dictionaryId
                    })
                    : 
                    [],
                unitConfigure: d.data.unitConfigureList.map(item => {
                    return {
                        id: item.dictionaryId,
                        name: item.dictionaryName
                    }
                })
            })
        } else if (d.data) {
            d.data = Object.assign({}, d.data, {
                showtype: 2, 
                edit: true, 
                title: '查看费用项', 
                itemId: d.data.id, 
                // reimbursement: d.data.shibaoshixiao,
                combackuses: d.data && isArray( d.data.expenseUses.split(',')) ? 
                    d.data.expenseUses.split(',').map(item => costUsagesTitleToId[item])
                    : 
                    []
                ,
                uses: d.data.expenseUses ? d.data.expenseUses.split(',').map(item => {
                    let obj = {id: costUsagesTitleToId[item], name: item}
                    return obj
                }) : [],
                combackROrPChangeValue: d.data && d.data.receivableOrPayable && isArray( d.data.receivableOrPayable.split(',')) ? 
                d.data.receivableOrPayable.split(',').map(item => costUsagesTitleToId[item])
                : [],
                receivableOrPayableChangeValue: d.data.receivableOrPayable ? d.data.receivableOrPayable.split(',').map(item => {
                    let obj = {id: costUsagesTitleToId[item], name: item}
                    return obj
                }) : [],
                combackUnit: d.data && isArray(d.data.unitConfigureList) ? 
                    d.data.unitConfigureList.map(item => {
                        return item.dictionaryId
                    })
                    : 
                    [],
                unitConfigure: d.data.unitConfigureList
            })
        } else {
            this.setState({
                showtype: 3, 
                title:'新建费用项',
                id: null
            })
        }
        let filterId = d.data ? d.data.id : null
        let { unitData, orignUnitData } = this.state
        let filterUnitData = unitData && unitData.length > 0 ? unitData.filter(item => item.label !== '车次' && item.label !== '天' && item.label !== '月') : []
        this.setState({
            ...d.data,
            historyData: historyData,
            unitData: filterId === 2 ? filterUnitData : orignUnitData,
            open: true,
            edit: d.edit
        })
    }

    onSaveSubmit = () => {
        const { rApi } = this.props
        let {
            showtype,
            itemId,
            code, // 费用代码
            name, // 费用名称
            typeName, // 费用类型名称
            typeId, // 费用类型id
            combackUnit, //单位配置
            unitConfigure,
            uses, // 费用用途
            // reimbursement, // 实报实销
            billingMethodId, //计费方式id
            billingMethodName, //计费方式name
            receivableOrPayable,
            receivableOrPayableChangeValue,
            remark, // 备注
            isMonthlyCalculation
        } = this.state

        if(billingMethodName !== '报价计费') {
            unitConfigure = []
        }
        //console.log('typeName', typeName)
        // let usesValue = []
        if(typeName === '仓储费用') {
            uses = [{id: 219, name: '仓储'}]
        } else if(typeName === '关务费用') {
            uses = [{id: 262, name: '关务'}]
        } else if(typeName === '运输费用'){
            uses = uses.filter(item => item.id)
        } else {
            uses = []
        }
        receivableOrPayableChangeValue = receivableOrPayableChangeValue.filter(item => item.id)
        this.setState({
            buttonLoading: true
        })
        // console.log('typeId', typeId)
        if(showtype === 1) {
            rApi.editCostItem({
                id: itemId, 
                code, // 费用代码
                name, // 费用名称
                typeName, // 费用类型名称
                typeId, // 费用类型id
                unitConfigure: unitConfigure,//单位配置
                expenseUseList: uses, // 费用用途
                billingMethodId, //计费方式id
                billingMethodName, //计费方式name
                receivableOrPayable: receivableOrPayableChangeValue,
                isMonthlyCalculation,
                // shibaoshixiao: reimbursement, // 实报实销
                remark, // 备注
            }).then(() => {
                message.success('操作成功!')
                this.changeOpen(false)
                this.setState({
                    buttonLoading: false
                }, () => {
                    this.updateThisDataToTable({
                        id: itemId, 
                        code, // 费用代码
                        name, // 费用名称
                        typeName, // 费用类型名称
                        typeId, // 费用类型id
                        isMonthlyCalculation,
                        unitConfigureList: unitConfigure && unitConfigure.length > 0 ? unitConfigure.map(item => {
                            return {
                                dictionaryId: item.id,
                                dictionaryName: item.name   
                            }
                        }) : [],//单位配置
                        expenseUses: uses && uses.length > 0 ? uses.map(item => item.name).join(',') : '', // 费用用途
                        billingMethodId, //计费方式id
                        billingMethodName, //计费方式name
                        receivableOrPayable: receivableOrPayableChangeValue && receivableOrPayableChangeValue.length > 0 ? receivableOrPayableChangeValue.map(item => item.name).join(',') : '', // 费用用途
                        remark: remark
                    })
                })
                //this.actionDone()
            }).catch(e => {
                message.error('操作失败！')
                this.setState({
                    buttonLoading: false
                })
            })
        } else if(showtype === 2) {
            this.changeOpen(false)
        } else if(showtype === 3) {
            rApi.addCostItem({
                code, // 费用代码
                name, // 费用名称
                typeName, // 费用类型名称
                typeId, // 费用类型id
                unitConfigure: unitConfigure,//单位配置
                expenseUseList: uses, // 费用用途
                billingMethodId, //计费方式id
                billingMethodName, //计费方式name
                receivableOrPayable: receivableOrPayableChangeValue,
                isMonthlyCalculation,
                // shibaoshixiao: reimbursement, // 实报实销
                remark, // 备注
            }).then(() => {
                this.setState({
                    buttonLoading: false
                })
                this.actionDone()
            }).catch(e => {
                message.error('操作失败！')
                this.setState({
                    buttonLoading: false
                })
            })
        }
    }

    onSubmit = () => {
        //e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            //console.log('Received values of form: ', values);
            this.onSaveSubmit()
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

    actionDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        this.changeOpen(false)
        message.success('操作成功！')
    }

    onChange = (value) => {
        // console.log('onChange', value)
        this.setState({uses: value.map(item => {
                return {
                    id: item,
                    name: costUsagesIdToTitle[item]
                }
            }),
            //combackuses
        })
    }
    onChangereceiveOrPay = (value) => {
        this.setState({receivableOrPayableChangeValue: value.map(item => {
                return {
                    id: item,
                    name: costUsagesIdToTitle[item]
                }
            }),
            //combackuses
        })
    }
    //receivableOrPayable
    onChangeUnit = (value) => {
        //console.log('onChangeUnit', value)
        this.setState({unitConfigure: value.map(item => {
                return {
                    id: item,
                    name: costUnitIdToTitle[item]
                }
            })
        })
    }

    isArr = (value) => {
        try {
            return value.map(item => {
                return item.dictionaryName
            }).join(',')
        } catch (e) {
        }
        return ''
    }
    render() { 
        let { 
            open,
            carcode,
            showtype,
            title,
            code, // 费用代码
            name, // 费用名称
            typeName, // 费用类型名称
            typeId, // 费用类型id
            uses, // 费用用途
            // reimbursement, // 实报实销
            remark, // 备注 
            receivableOrPayable,
            combackuses,
            combackROrPChangeValue,
            expenseUses,
            unitConfigure,
            combackUnit,
            unitData,
            billingMethodId,
            billingMethodName,
            buttonLoading,
            id,
            costTypeList,
            receiveOrPayList,
            receivableOrPayableChangeValue,
            costUsages,
            isMonthlyCalculation,
            isCl
        } = this.state
       //  console.log('combackuses',combackuses, combackROrPChangeValue, receivableOrPayable)
        const { getFieldDecorator, setFieldsValue } = this.props.form
        return (
            <Modal
                onSubmit={this.onSubmit}
                style={{width: '95%', maxWidth: 700}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                haveFooter={showtype === 2 ? false : true}
                footerText="保存"
                loading={buttonLoading}
                getContentDom={v => this.popupContainer = v}
                >
                    <Form layout='inline'>
                        {/* <Modal.Header title={'费用项明细'}>
                           {
                               showtype === 2 ?
                                    null
                                    :
                                    <FormItem>
                                        <Button 
                                            // icon='save' 
                                            htmlType="submit" 
                                            style={{ marginRight: 0, border: 0, color: '#fff', background: '#18B583 ' }}
                                            loading={buttonLoading}
                                        >
                                            保存
                                        </Button>
                                    </FormItem>
                           }
                        </Modal.Header> */}
                        <div className="costitem-wrapper" style={{padding: '5px 20px', margin: 'auto'}}>
                            <Row gutter={24}>
                                <Col label="费用代码" span={20}>
                                    <Input 
                                        style={{width: 200, borderRadius: 0}}
                                        disabled
                                        value={code ? code : ''}
                                        placeholder="自动生成"
                                        onChange={e => {this.setState({code: e.target.value})}}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col isRequired label="费用名称" span={20}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('name', {
                                                initialValue: name,
                                                rules: [
                                                    { 
                                                        required: true, 
                                                        message: '请填写费用名称'
                                                    }
                                                ]
                                            })(
                                                <Input 
                                                    style={{width: 200, borderRadius: 0}}
                                                    disabled={(id === 1 || id === 2 || showtype === 2) ? true : false}
                                                    placeholder="" 
                                                    onChange={e => {this.setState({name: e.target.value})}}
                                                />
                                            )
                                        }
                                        </FormItem>
                                </Col>
                            </Row>
                            {/* <Row gutter={24} type={(id === 1 || id === 2) ? 2 : showtype } >
                                <Col label="费用类型" span={7} text={typeName} >
                                    <RemoteSelect
                                        onChangeValue={(value = {}) => this.setState({typeId: value.id, typeName: value.title})} 
                                        defaultValue={
                                            {
                                                id: typeId,
                                                title: typeName
                                            }
                                        }
                                        text="费用类型"
                                    />
                                </Col>
                            </Row> */}
                            {
                                   costTypeList && costTypeList.length > 0 ?
                                   <Row gutter={24}>
                                       <Col label="费用类型" span={24}>
                                            <Radio.Group 
                                                value={typeName ? typeName : costTypeList[0].title} 
                                                buttonStyle="solid"
                                                onChange={(e) => {
                                                    this.setState({
                                                        typeName: e.target.value,
                                                        typeId: e.target.key,
                                                        // uses: [],
                                                        // combackuses: [],
                                                        isCl: true
                                                    }, () => {
                                                        this.getUnitData()
                                                        this.setState({
                                                            isCl: false
                                                        })
                                                    })
                                                }}
                                            >
                                                {
                                                    costTypeList.map((item, index) => {
                                                        return(
                                                            <Radio.Button 

                                                                style={{borderRadius: 0}}
                                                                disabled={(id === 1 || id === 2 || showtype === 2) ? true : false}
                                                                key={item.id} 
                                                                value={item.title}
                                                            >
                                                                {item.title}
                                                            </Radio.Button>
                                                        )
                                                    } )
                                                }
                                            </Radio.Group>
                                       </Col>
                                   </Row>
                                   :
                                   null
                            }
                            {
                                costTypeList && costTypeList.length > 0 ?
                                <div style={{background: '#f7f7f7 ', margin: '8px 70px', padding: '10px 10px 10px 25px'}}>
                                    <div>
                                        {/* <RadioGroup 
                                            onChange={e => {
                                                this.setState({
                                                    receivableOrPayable: e.target.value
                                                })
                                            }} 
                                            value={receivableOrPayable ? receivableOrPayable : '应收'}
                                        >
                                        {
                                            receiveOrPayList.map((item, index) => {
                                                return(
                                                    <Radio 
                                                        disabled={(id === 1 || id === 2 || showtype === 2) ? true : false}
                                                        key={item.id} 
                                                        value={item.title}
                                                        >
                                                        {item.title}
                                                    </Radio>
                                                )
                                            })
                                        }
                                        </RadioGroup> */}
                                        <Row gutter={24}>
                                            <Col span={24} contentStyle={{whiteSpace: 'normal'}}>
                                                {
                                                    isCl ?
                                                    null
                                                    :
                                                    <CheckboxGroup
                                                        disabled={(id === 1 || id === 2 || showtype === 2) ? true : false}
                                                        defaultValue={combackROrPChangeValue ? combackROrPChangeValue : []}
                                                        //value={combackuses ? combackuses : []}
                                                        options={receiveOrPayList} 
                                                        onChange={this.onChangereceiveOrPay} 
                                                />
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                    {
                                        typeName === '运输费用' || (typeName === '运输费用' && showtype === 3) ?
                                        <div>
                                            <Row gutter={24}>
                                                <Col span={24} contentStyle={{whiteSpace: 'normal'}}>
                                                    {
                                                        isCl ?
                                                        null
                                                        :
                                                        <CheckboxGroup
                                                            disabled={(id === 1 || id === 2 || showtype === 2) ? true : false}
                                                            defaultValue={combackuses ? combackuses : []}
                                                            //value={combackuses ? combackuses : []}
                                                            options={costUsages} 
                                                            onChange={this.onChange} 
                                                    />
                                                    }
                                                </Col>
                                            </Row>
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                                :
                                null
                            }
                            <Row gutter={24}>
                                <Col label="计费方式" span={7}>
                                    <RemoteSelect
                                        style={{borderRadius: 0}}
                                        disabled={(id === 1 || id === 2 || showtype === 2) ? true : false}
                                        defaultValue={billingMethodId ? {id: billingMethodId, title: billingMethodName} : null}
                                        getPopupContainer={() => this.popupContainer || document.body}
                                        onChangeValue={
                                            value => {
                                                this.setState({
                                                    billingMethodId: value ? value.id : '',
                                                    billingMethodName: value ? value.title : ''

                                                })
                                            }
                                        } 
                                        labelField={'title'}
                                        text='计费方式'
                                    />
                                </Col>
                            </Row>
                            {
                                billingMethodName === '报价计费' ?
                                <div style={{background: '#f7f7f7 ', margin: '8px 70px', padding: '10px 10px 10px 25px'}}>
                                    <div>
                                        <Row gutter={24}>
                                            <Col span={24} contentStyle={{whiteSpace: 'normal'}}>
                                                <CheckboxGroup
                                                    disabled={((id === 1 || id === 2) &&  showtype === 2) ? true : (showtype === 2) ? true : false}
                                                    defaultValue={combackUnit ? combackUnit : []}
                                                    options={unitData} 
                                                    onChange={this.onChangeUnit} 
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                :
                                null
                            }
                            <Row gutter={24}>
                                <Col  label="允许月结">
                                    <Switch 
                                        checked={isMonthlyCalculation === 1 ? true : false}
                                        size={'small'}
                                        disabled={showtype === 2 ? true : false}
                                        checkedChildren="是" 
                                        unCheckedChildren="否" 
                                        onChange={(value) => {
                                            console.log('onChange', value)
                                            this.setState({
                                                isMonthlyCalculation: value ? 1 : 0
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col  label="&emsp;&emsp;备注" span={24}>
                                    <Input
                                        disabled={(id === 1 || id === 2 || showtype === 2) ? true : false}
                                        defaultValue={remark ? remark : ''}
                                        style={{width: 400, borderRadius: 0}}
                                        placeholder=""
                                        title={remark}
                                        onChange={e => {this.setState({remark: e.target.value})}}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Form>
            </Modal>
        )
    }
}
 
export default Form.create()(AddRoEdit);