import React from 'react';
import Alert from 'react-bootstrap/Alert';

function DragnDropAlert(props) {
  if (props.show) {
    return (
      <Alert variant="danger" onClose={props.onClose} dismissible>
        <p>{props.show}</p>
      </Alert>
    );
  } 
  return null;
}

export default DragnDropAlert;