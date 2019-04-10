import React from 'react';
import { Avatar, List } from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';

export default function NoticeList({
  data = [], onClick, onClear, title, locale, emptyText, emptyImage,
}) {
  if (data.length === 0) {
    return (
      <div className='notFound'>
        {emptyImage ? (
          <img src={emptyImage} alt="not found" />
        ) : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          const itemCls = classNames('item', {
            read: item.read,
          });
          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                avatar={item.avatar ? <Avatar className={styles.avatar} src={item.avatar} /> : null}
                title={
                  <div className={'title'}>
                    <span style={{wordBreak: 'break-all'}}>{item.title}</span>
                    <span className={'extra'}>{item.extra}</span>
                  </div>
                }
                description={
                  <div>
                    <div className='description' title={item.description}>
                      {item.description}
                    </div>
                    <div className='datetime'>{item.datetime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      <div className='clear' onClick={onClear}>
        {locale.clear}{title}
      </div>
    </div>
  );
}
