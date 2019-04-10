import React, { Component, Fragment } from 'react'

class Header extends Component {

    static defaultProps = {
        title: '',
        isHide: false
    }

    render() { 
        const { title, isHide } = this.props
        let { children } = this.props
        if (children && Object.prototype.toString.call(children) !== '[object Array]') {
            children = [children]
        } else if (!children) {
            children = []
        }
        //console.log('propssssss', this.props)
        return (
            <Fragment>
                {
                    isHide ?
                    null
                    :
                    <div className='flex flex-vertical-center' style={{borderBottom: '1px solid rgb(238, 238, 238)',padding: '10px 20px'}}>
                        <div style={{lineHeight:'32px', fontSize: '14px' }}>
                            {title}
                        </div>
                        <div className='flex1'>
                        </div>
                        {
                            children.map((item, index) => {
                                return (
                                    <div key={index}>
                                        {item}
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </Fragment>
        )
    }
}
 
export default Header;