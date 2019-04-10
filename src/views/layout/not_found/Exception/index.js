import React, { createElement } from 'react';
// import classNames from 'classnames';
import { Button } from 'antd';
import config from './typeConfig';
import './index.less';

export default ({ className, linkElement = 'a', type, title, desc, img, actions, ...rest }) => {
  const pageType = type in config ? type : '404';
  // const clsString = classNames(styles.exception, className);
  return (
    <div style={{position: 'absolute', height: '100%', width: '100%'}}>
      <div className='exception flex flex-vertical-center' {...rest}>
        <div className='imgBlock'>
          <div
            className='imgEle'
            style={{ backgroundImage: `url(${img || config[pageType].img})` }}
          />
        </div>
        <div className='content'>
          <h1>{title || config[pageType].title}</h1>
          <div className='desc'>{desc || config[pageType].desc}</div>
          <div className='actions'>
            {
              actions ||
                createElement(linkElement, {
                  to: '/',
                  href: '/',
                }, <Button type="primary">返回首页</Button>)
            }
          </div>
        </div>
      </div>
    </div>
  );
};
