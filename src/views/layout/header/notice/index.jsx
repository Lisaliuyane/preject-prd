import NoticeIcon from '@src/components/NoticeIcon';
import React, { Component } from 'react'
import { getNotices } from '@src/mock/notices'
// import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import { Tag } from 'antd';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import './notice.less'

const types = ['研发', '客服', '运营', '资源', '财务']

export default class Notice extends Component {

    constructor(props) {
        super(props)
        this.noticeData = this.getNoticeData();
    }

    getNoticeData() {
        // console.log('getNotices', getNotices)
        const notices = getNotices();
        if (notices.length === 0) {
            return {};
        }
        const newNotices = notices.map((notice) => {
            const newNotice = { ...notice };
            if (newNotice.datetime) {
                newNotice.datetime = moment(notice.datetime).fromNow();
            }
            // transform id to item key
            if (newNotice.id) {
                newNotice.key = newNotice.id;
            }
            if (newNotice.extra && newNotice.status) {
                const color = ({
                    todo: '',
                    processing: 'blue',
                    urgent: 'red',
                    doing: 'gold',
                })[newNotice.status];
                newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
            }
            return newNotice;
        });
        return groupBy(newNotices, 'type');
    }
    onNoticeClear() {
        console.log('onNoticeClear')
    }
    render() {
        const noticeData = this.noticeData
        return (
            <NoticeIcon
                className='action'
                count={10}
                onItemClick={(item, tabProps) => {
                    console.log(item, tabProps); // eslint-disable-line
                }}
                onClear={this.onNoticeClear}
                // onPopupVisibleChange={onNoticeVisibleChange}
                loading={false}
                popupAlign={{ offset: [20, -16] }}
            >
                <NoticeIcon.Tab
                    list={noticeData['通知']}
                    title="通知"
                    emptyText="你已查看所有通知"
                    emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                {
                    types.map((type, index) => {
                        return (
                            <NoticeIcon.Tab
                                key={index}
                                list={noticeData[type]}
                                title={type}
                                emptyText="没有消息"
                                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                            />
                        )
                    })
                }
            </NoticeIcon>
        )
    }
}
// <NoticeIcon.Tab
//                   list={noticeData['通知']}
//                   title="通知"
//                   emptyText="你已查看所有通知"
//                   emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
//                 />
//                 <NoticeIcon.Tab
//                   list={noticeData['消息']}
//                   title="消息"
//                   emptyText="您已读完所有消息"
//                   emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
//                 />
//                 <NoticeIcon.Tab
//                   list={noticeData['待办']}
//                   title="待办"
//                   emptyText="你已完成所有待办"
//                   emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
//                 />