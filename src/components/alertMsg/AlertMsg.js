import React from 'react';
import { Alert } from 'react-bootstrap';

function AlertMsg(props) {
  //To covert first character in to upper case.  
  const capitalize = (word) => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
    return (
      props.alert && <Alert id='alert' className='text-center mx-5 border border-2 border-danger' variant={`${props.alert.type} + ${props.alert.border}`}>
        <p>
          {capitalize(props.alert.type)}: {props.alert.msg}  
        </p>
      </Alert>
    );
}
    

export default AlertMsg;