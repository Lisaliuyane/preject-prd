import React, { Component } from 'react'
import { isArray } from '@src/utils'
import PropTypes from 'prop-types'
import './index.less'

class ItemLineToItem extends Component {

    static propTypes = {
        leftView: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.array
        ]),
        leftButton: PropTypes.element,
        rightView: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.array
        ]),
        rightButton: PropTypes.element
    }

    addItem = () => {
        this.setState(preState => {
            let state = [...preState.array, 1]
            return {
                array: state
            }
        })
    }

    
    componentWillUnmount() {
        clearTimeout(this.timer)
    }
    

    darwLine = () => {
        let offsetTop = this.view.offsetTop
        // console.log('this.view.offsetHeight', this.view.offsetHeight)
        this.canvas.style.display = 'none'
        this.canvas.height = this.view.offsetHeight
        // console.log('this.view.offsetHeight', this.view.offsetHeight, [this.view])
        let cxt = this.canvas.getContext('2d')
        let leftViews = Array.prototype.slice.call(this.leftView.children) || []
        if (!isArray(leftViews) && leftViews) {
            leftViews = [leftViews]
        }
        // console.log('leftViews', leftViews)
        let leftCoordinates = leftViews.map(item => {
            return {
                x: 0,
                y: item.offsetTop - offsetTop + (item.offsetHeight / 2)
            }
        })
        let rightViews = Array.prototype.slice.call(this.rightView.children) || []
        if (!isArray(rightViews) && rightViews) {
            rightViews = [rightViews]
        }
        // console.log('this.canvas.offsetWidth', this.canvas.offsetWidth, this.canvas.width)
        let rightCoordinates = rightViews.map(item => {
            return {
                x: this.canvas.width,
                y: item.offsetTop - offsetTop + (item.offsetHeight / 2)
            }
        })
        //console.log('this.canvas.offsetWidth', leftCoordinates, rightCoordinates)
        cxt.setLineDash([6, 6])
        cxt.lineWidth = 2
        cxt.strokeStyle = '#ccc'
        leftCoordinates.forEach(element => {
            rightCoordinates.forEach(item => {
                cxt.moveTo(element.x, element.y)
                cxt.lineTo(item.x, item.y)
                // console.log('item.x', item.x)
            })
        })
        cxt.stroke()
        this.canvas.style.display = 'block'
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.darwLine()
        }, 100)
    }

    componentWillReceiveProps() {
        //console.log('componentWillReceiveProps')
        if (this.canvas) {
            let cxt = this.canvas.getContext('2d')
            cxt.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }

    componentWillUpdate() {
        //console.log('componentWillUpdate')
        if (this.canvas) {
            let cxt = this.canvas.getContext('2d')
            cxt.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }

    componentDidUpdate() {
        if (this.leftView && this.rightView && this.canvas && this.view) {
            //console.log('componentDidUpdate')
            this.darwLine()
        }
    }

    render() {
        const {
            leftView,
            leftButton,
            rightView,
            rightButton
        } = this.props
        return (
            <div 
                className='flex' 
                style={{width: '100%'}}>
                <div style={{minWidth: 185}}>
                    <div ref={v => this.leftView = v}>
                        {
                            leftView
                        }
                        
                    </div>
                    <div className='flex' style={{justifyContent: 'center'}}>
                        {
                            leftButton
                        }
                    </div>
                </div>
                <div ref={v => this.view = v} className='flex1'>
                    <canvas height={10} style={{width: '100%'}} ref={v => this.canvas = v} />
                </div>
                <div style={{minWidth: 185}}>
                    <div ref={v => this.rightView = v}>
                        {
                            rightView
                        }
                    </div>
                    <div className='flex' style={{justifyContent: 'center'}}>
                        {
                            rightButton
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default ItemLineToItem;