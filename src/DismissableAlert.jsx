import React from 'react';
import Alert from 'react-bootstrap/Alert';

function DismissableAlert(props) {
  if (props.show) {
    return (
      <Alert variant={props.type} onClose={props.onClose} dismissible>
        <p>{props.show}</p>
      </Alert>
    );
  }
  return null;
}

export default DismissableAlert;
