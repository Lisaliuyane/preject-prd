import React from 'react'

const title = props => (
    <div className="flex flex-vertical-center">
        <div style={{marginLeft: '5px'}}>
            {props.name}
        </div>
        
    </div>
);
// <div className="flex1" style={{textAlign: 'right'}}>
//             <Button onClick={this.addItem.bind(this)} title='添加' type="primary" ghost shape="circle" icon="plus" size='small' />
//         </div>
export default title