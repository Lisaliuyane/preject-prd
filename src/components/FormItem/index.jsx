import * as React from 'react'
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Row from 'antd/lib/grid/row'
import Col from 'antd/lib/grid/col'
import warning from 'antd/lib/_util/warning'
import { Popover } from 'antd'

const FIELD_META_PROP = 'data-__meta'
const FIELD_DATA_PROP = 'data-__field'

export default class FormItem extends React.Component {

    static defaultProps = {
        hasFeedback: false,
        prefixCls: 'ant-form',
        colon: true,
        isCustomChildren: false,
        wrapperStyle: {width: '100%'},
        isNonePopWindow: false
    };

    static propTypes = {
        prefixCls: PropTypes.string,
        isCustomChildren: PropTypes.bool,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        labelCol: PropTypes.object,
        help: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
        validateStatus: PropTypes.oneOf(['', 'success', 'warning', 'error', 'validating']),
        hasFeedback: PropTypes.bool,
        wrapperCol: PropTypes.object,
        className: PropTypes.string,
        id: PropTypes.string,
        children: PropTypes.node,
        colon: PropTypes.bool,
        wrapperStyle: PropTypes.object
    };

    static contextTypes = {
        vertical: PropTypes.bool,
    };

    constructor (props) {
        super(props)
        this.state = {
            _reload: false
        }
    }

    context = {
        vertical: false
    };

    helpShow = false;

    componentDidMount() {
        warning(
            this.getControls(this.props.children, true).length <= 1,
            '`Form.Item` cannot generate `validateStatus` and `help` automatically, ' +
            'while there are more than one `getFieldDecorator` in it.',
        );
    }

    getHelpMsg() {
        const props = this.props;
        const onlyControl = this.getOnlyControl();
        if (props.help === undefined && onlyControl) {
            const errors = this.getField().errors;
            return errors ? errors.map((e) => e.message).join(', ') : '';
        }

        return props.help;
    }

    getControls(children, recursively) {
        let controls = [];
        const childrenArray = React.Children.toArray(children);
        for (let i = 0; i < childrenArray.length; i++) {
            if (!recursively && controls.length > 0) {
                break;
            }

            const child = childrenArray[i];
            if (child.type &&
                (child.type === FormItem || child.type.displayName === 'FormItem')) {
                continue;
            }
            if (!child.props) {
                continue;
            }
            if (FIELD_META_PROP in child.props) { // And means FIELD_DATA_PROP in chidl.props, too.
                controls.push(child);
            } else if (child.props.children) {
                controls = controls.concat(this.getControls(child.props.children, recursively));
            }
        }
        return controls;
    }

    getOnlyControl() {
        const child = this.getControls(this.props.children, false)[0];
        return child !== undefined ? child : null;
    }

    getChildProp(prop) {
        let child = this.getOnlyControl();
        const { isCustomChildren } = this.props
        if (isCustomChildren) {
            // console.log('getChildProp', child, child && child.props && child.props[prop], prop, isCustomChildren)
        } else {
            // console.log('getChildProp', child, child && child.props && child.props[prop], prop, isCustomChildren)
        }
        return child && child.props && child.props[prop];
    }

    getId() {
        return this.getChildProp('id');
    }

    getMeta() {
        return this.getChildProp(FIELD_META_PROP);
    }

    getField() {
        return this.getChildProp(FIELD_DATA_PROP);
    }

    onHelpAnimEnd = (_key, helpShow) => {
        this.helpShow = helpShow;
        if (!helpShow) {
            this.setState({});
        }
    }

    /**
     * 渲染提示
     * 
     * @returns React.Element
     * 
     * @memberOf FormItem
     */
    renderHelp = () => {
        const { isNonePopWindow } = this.props
        const prefixCls = this.props.prefixCls;
        const help = this.getHelpMsg();
        // if (!this.dom) return null
        // console.log('this.dom', this.dom)
        const children = help && !isNonePopWindow ? (
            // <div className={`${prefixCls}-explain`} key="help">
            //     {help}
            // </div>
            <Popover 
                getPopupContainer={() => {
                    // console.log('this.dom', this.dom)
                    return this.dom
                }} 
                overlayClassName={'form-tooltip form-error-pop'} 
                trigger="click" 
                content={<span style={{color: 'red'}}>{help}</span>}
                visible={true} 
                placement="topLeft">
                <div style={{left: -10, top: 20, position: 'absolute'}} className={`${prefixCls}-explain`} key="help"></div>
            </Popover>
            // <div style={{left: -10, bottom: 20, background: 'white', }} className={`${prefixCls}-explain ant-popover-inner`} key="help">{help}</div>
        ) : null;
        if (children) {
            this.helpShow = !!children;
        }
        return children
        // return (
        //     <Animate
        //         transitionName="show-help"
        //         component=""
        //         transitionAppear
        //         key="help"
        //         onEnd={this.onHelpAnimEnd}
        //     >
        //         {children}
        //     </Animate>
        // );
    }

    renderExtra() {
        const { prefixCls, extra } = this.props;
        return extra ? (
            <div className={`${prefixCls}-extra`}>{extra}</div>
        ) : null;
    }

    getValidateStatus() {
        const onlyControl = this.getOnlyControl();
        if (!onlyControl) {
            return '';
        }
        const field = this.getField();
        if (field.validating) {
            return 'validating';
        }
        if (field.errors) {
            return 'error';
        }
        const fieldValue = 'value' in field ? field.value : this.getMeta().initialValue;
        if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
            return 'success';
        }
        return '';
    }

    renderValidateWrapper(c1, c2, c3) {
        const props = this.props;
        const onlyControl = this.getOnlyControl;
        const validateStatus = (props.validateStatus === undefined && onlyControl) ?
            this.getValidateStatus() :
            props.validateStatus;

        let classes = `${this.props.prefixCls}-item-control`;
        if (validateStatus) {
            classes = classNames(`${this.props.prefixCls}-item-control`, {
                'has-feedback': props.hasFeedback || validateStatus === 'validating',
                'has-success': validateStatus === 'success',
                'has-warning': validateStatus === 'warning',
                'has-error': validateStatus === 'error',
                'is-validating': validateStatus === 'validating',
            });
        }
        return (
            <div className={classes}>
                <span className={`${this.props.prefixCls}-item-children`}>{c1}</span>
                {c2}{c3}
            </div>
        );
    }

    renderWrapper(children) {
        const { prefixCls, wrapperCol, wrapperStyle } = this.props;
        const className = classNames(
            `${prefixCls}-item-control-wrapper`,
            wrapperCol && wrapperCol.className,
        );
        return (
            <Col {...wrapperCol} style={{...wrapperStyle, padding: 0} } className={className} key="wrapper">
                {children}
            </Col>
        );
    }

    isRequired() {
        const { required } = this.props;
        if (required !== undefined) {
            return required;
        }
        if (this.getOnlyControl()) {
            const meta = this.getMeta() || {};
            const validate = meta.validate || [];

            return validate.filter((item) => !!item.rules).some((item) => {
                return item.rules.some((rule) => rule.required);
            });
        }
        return false;
    }

    // Resolve duplicated ids bug between different forms
    // https://github.com/ant-design/ant-design/issues/7351
    onLabelClick = (e) => {
        const { label } = this.props;
        const id = this.props.id || this.getId();
        if (!id) {
            return;
        }
        const controls = document.querySelectorAll(`[id="${id}"]`);
        if (controls.length !== 1) {
            // Only prevent in default situation
            // Avoid preventing event in `label={<a href="xx">link</a>}``
            if (typeof label === 'string') {
                e.preventDefault();
            }
            const formItemNode = ReactDOM.findDOMNode(this);
            const control = formItemNode.querySelector(`[id="${id}"]`);
            if (control && control.focus) {
                control.focus();
            }
        }
    }

    renderLabel() {
        const { prefixCls, label, labelCol, colon, id } = this.props;
        const context = this.context;
        const required = this.isRequired();

        const labelColClassName = classNames(
            `${prefixCls}-item-label`,
            labelCol && labelCol.className,
        );
        const labelClassName = classNames({
            [`${prefixCls}-item-required`]: required,
        });

        let labelChildren = label;
        // Keep label is original where there should have no colon
        const haveColon = colon && !context.vertical;
        // Remove duplicated user input colon
        if (haveColon && typeof label === 'string' && (label).trim() !== '') {
            labelChildren = (label).replace(/[：|:]\s*$/, '');
        }

        return label ? (
            <Col {...labelCol} className={labelColClassName} key="label">
                <label
                    htmlFor={id || this.getId()}
                    className={labelClassName}
                    title={typeof label === 'string' ? label : ''}
                    onClick={this.onLabelClick}
                >
                    {labelChildren}
                </label>
            </Col>
        ) : null;
    }

    renderChildren() {
        const { children } = this.props;
        return [
            this.renderLabel(),
            this.renderWrapper(
                this.renderValidateWrapper(
                    children,
                    this.renderHelp(),
                    this.renderExtra(),
                ),
            ),
        ];
    }

    renderFormItem (children) {
        const props = this.props;
        const prefixCls = props.prefixCls;
        const style = props.style;
        const itemClassName = {
            [`${prefixCls}-item`]: true,
            // [`${prefixCls}-item-with-help`]: this.helpShow,
            [`${prefixCls}-item-no-colon`]: !props.colon,
            [`${props.className}`]: !!props.className,
        };
        return (
            <Row className={classNames(itemClassName)} style={{width: '100%', marginRight: 0, marginBottom: 0, ...style}}>
                {children}
            </Row>
        );
    }

    getEqClassName(dom) {
        if (dom.className && dom.className.length > 0) {
            let classNames = dom.className.split(' ')
            for (let item of classNames) {
                if (item === 'ant-table-fixed') {
                    return true
                }
            }
        }
        return false
    }

    treeNode = (dom, i) => {
        i++
        if (i < 100) {
            if (this.getEqClassName(dom)) {
                // console.log('this.getEqClassName', this.dom)
                this.dom = dom
            } else if (dom.tagName === 'TABLE') {
                // dom.parentElement.style.position = 'relative'
                // console.log('findDom', this.dom, dom)
                this.dom = dom
            } else if (dom.tagName === 'FORM') {
                // console.log('dom.tagName', this.dom)
                this.dom = dom
            } else {
                this.treeNode(dom.parentElement, i)
            }
        }
        
    }

    findDom = (ref) => {
        this.dom = ref
        this.treeNode(ref, 0)
        // console.log('findDom', this.dom)
    }

    render() {
        const children = this.renderChildren();
        return (
            <span 
            style={{position: 'relative'}}
            ref={ref => {if (ref) {
                this.findDom(ref)
            }}}>
                {
                    this.renderFormItem(children)
                }
            </span>
        )
    }
}
