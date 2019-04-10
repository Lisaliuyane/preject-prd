import React, { PureComponent } from 'react';
import { Popover, Icon, Tabs, Badge, Spin } from 'antd';
import classNames from 'classnames';
import List from './NoticeList';
import './index.less';
import notice_icon from '@src/libs/img/notice.svg'

const { TabPane } = Tabs;

export default class NoticeIcon extends PureComponent {
    static defaultProps = {
        onItemClick: () => { },
        onPopupVisibleChange: () => { },
        onTabChange: () => { },
        onClear: () => { },
        loading: false,
        locale: {
            emptyText: '暂无数据',
            clear: '清空',
        },
        emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
    };
    static Tab = TabPane;
    constructor(props) {
        super(props);
        this.state = {};
        if (props.children && props.children[0]) {
            this.state.tabType = props.children[0].props.title;
        }
    }
    onItemClick = (item, tabProps) => {
        const { onItemClick } = this.props;
        onItemClick(item, tabProps);
    }
    onTabChange = (tabType) => {
        this.setState({ tabType });
        this.props.onTabChange(tabType);
    }
    getNotificationBox() {
        const { children, loading, locale } = this.props;
        if (!children) {
            return null;
        }
        const panes = React.Children.map(children, (child, index) => {
            const title = child.props.list && child.props.list.length > 0
                ? `${child.props.title} (${child.props.list.length})` : child.props.title;
            return (
                <TabPane style={{ maxHeight: '500px', overflow: 'auto' }} tab={title} key={child.props.title}>
                    <List
                        {...child.props}
                        data={child.props.list}
                        onClick={item => this.onItemClick(item, child.props)}
                        onClear={() => this.props.onClear(child.props.title)}
                        title={child.props.title}
                        locale={locale}
                    />
                </TabPane>
            );
        });
        return (
            <Spin spinning={loading} delay={0}>
                <Tabs tabPosition='left' className={'tabs'} onChange={this.onTabChange}>
                    {panes}
                </Tabs>
            </Spin>
        );
    }
    render() {
        const { className, count, popupAlign, onPopupVisibleChange } = this.props;
        const noticeButtonClass = classNames(className, 'noticeButton');
        const notificationBox = this.getNotificationBox();
        const trigger = (
            <div className='right-bottom' style={{paddingTop: 3, paddingRight: 5}}>
                <span className={noticeButtonClass}>
                    <Badge count={count} className={'badge'}>
                        {/* <Icon type="bell" className={'icon'} /> */}
                        <img src={notice_icon}/>
                        {/* <Icon type = "bell" style={{ fontSize: 17 }} / > */}
                    </Badge>
                </span>
            </div>
        );
        if (!notificationBox) {
            return trigger;
        }
        const popoverProps = {};
        if ('popupVisible' in this.props) {
            popoverProps.visible = this.props.popupVisible;
        }
        return (
            <Popover
                placement="bottomRight"
                content={notificationBox}
                popupClassName='popover'
                trigger="click"
                arrowPointAtCenter
                popupAlign={popupAlign}
                onVisibleChange={onPopupVisibleChange}
                {...popoverProps}
            >
                {trigger}
            </Popover>
        );
    }
}
