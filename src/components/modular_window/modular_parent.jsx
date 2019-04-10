import React, { Component } from 'react'
class ModularParent extends Component {
    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
    }
}
 
export default ModularParent;