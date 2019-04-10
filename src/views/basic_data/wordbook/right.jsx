import React, { Component } from 'react';
import { Table, Button, Icon } from 'antd';
import { DragSource, DropTarget } from 'react-dnd';
import WithDragDropContext from '@src/libs/share_HTML5Backend'
// import HTML5Backend from 'react-dnd-html5-backend';
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import * as TablePlugin from "@src/components/table_plugin"

function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}

let BodyRow = (props) => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moveRow,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        if (direction === 'downward') {
            className += ' drop-over-downward';
        }
        if (direction === 'upward') {
            className += ' drop-over-upward';
        }
    }

    return connectDragSource(
        connectDropTarget(
            <tr
                {...restProps}
                className={className}
                style={style}
            />
        )
    );
};

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
);

@inject('mobxWordBook', 'rApi')
@observer
class DragSortingTable extends Component {

    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        columns: [],
        dataSource: {}
    }

    constructor(props) {
        super(props)
        // let { mobxWordBook } = this.props
        // mobxWordBook.initBooks({key: 'bs'})
        this.state.columns = [
            {
                title: '值',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record, index) => {
                    return (
                        <span style={{color: !record.status?'#1DA57A':'#ccc'}}>
                        {
                            !record.status? '已启用' : '禁用'
                        }
                        </span>
                    )

                }
            }
        ]
        if (props.getRef) {
            props.getRef(this)
        }
    }

    components = {
        body: {
            row: BodyRow,
        }
    }

    refresh = () => {
        // console.log('refresh')
        this.getData()
    }

    moveRow = (dragIndex, hoverIndex) => {
        // let { mobxWordBook } = this.props
        // let selectType = mobxWordBook.selectType
        // let dataSource = mobxWordBook.wordbooks[selectType]

        // const dragRow = dataSource[dragIndex]
        // mobxWordBook.updateBooks([[dragIndex, 1], [hoverIndex, 0, dragRow]])
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.type !== this.props.type) {
            this.getData(nextProps.type)
        }
    }

    getAddoredit = (d) => {
        this.addoredit = d
    }

    addItem = () => {
        let { mobxWordBook, type } = this.props
        let { types } = mobxWordBook
        types = types.slice()
        let activeType = type || types[0].children[0].key
        
        this.addoredit.show({
            edit: false,
            key: activeType,
            title: '新建 ' + mobxWordBook.getSelectType(type).text
        })
    }

    onEdit = (item, index) => {
        let { mobxWordBook, type } = this.props
        let { types } = mobxWordBook
        types = types.slice()
        let activeType = type || types[0].children[0].key
        let addoredit = this.addoredit
        addoredit.show({
            edit: true,
            key: activeType,
            title: `编辑${mobxWordBook.getSelectType(type).text}, 序号：${index + 1}`,
            data: {...item, index: index}
        })
    }

    onDelete = (item, index) => {
        let { mobxWordBook, type } = this.props
        // console.log('del', item, index)
        mobxWordBook.delBook({...item, index: index}, type).then(() => {
            this.refresh()
        })
    }

    getData = (activeType) => {
        let { rApi, type } = this.props
        type = activeType || type
        this.setState({
            dataSource: {
                ...this.state.dataSource,
                [type]: []
            },
            loading: true
        })
        rApi.getWordBooks({id: activeType || type}).then(res => {
            this.setState({
                dataSource: {
                    ...this.state.dataSource,
                    [type]: res
                },
                loading: false
            })
        }).catch(e => {
            this.setState({
                loading: false
            })
        })
    }

    render() {
        const { dataSource, loading } = this.state
        let { mobxWordBook, type } = this.props
        // let { types } = mobxWordBook
        // types = types.slice()
        if (!type) return null

        let activeType = type
        // let loading = mobxWordBook.loading[activeType]
        // let key = mobxWordBook.getBookType({id: activeType}).key
        // let dataSource = mobxWordBook.wordbooks[key]
        const { selectedRowKeys, columns } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        // console.log('activeType', activeType, this.props)
        const title = () => (
            <div className="flex flex-vertical-center">
                <div style={{ marginLeft: '5px' }}>
                    { mobxWordBook.getBookType({id: activeType}).text}
                </div>
                <div className="flex1" style={{ textAlign: 'right' }}>
                    <Button onClick={this.addItem.bind(this)} style={{ marginRight: 10 }}><Icon type="plus" />新建</Button>
                </div>
            </div>
        )
        return (
            <div style={{ padding: '10px', maxWidth: '900px', width: '100%', minHeight: '300px', background: 'white' }}>
                <AddOrEdit refresh={this.refresh} getThis={this.getAddoredit}  ref='addoredit' />
                <Table
                    bordered
                    loading={loading}
                    title={title}
                    rowSelection={rowSelection}
                    pagination={false}
                    columns={TablePlugin.addAll(columns, this, '禁用')}
                    dataSource={dataSource[activeType]}
                    components={this.components}
                    onRow={
                        (record, index) => (
                            {
                                index,
                                moveRow: this.moveRow,
                            }
                        )
                    }
                />
            </div>
        );
    }
}

const RightView = WithDragDropContext(DragSortingTable);
export default RightView;