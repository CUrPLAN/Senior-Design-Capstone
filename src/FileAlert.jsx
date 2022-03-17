import React from 'react';
import Alert from 'react-bootstrap/Alert';

function FileAlert(props) {
  if (props.show === 'error') {
    return (
      <Alert variant="danger" onClose={props.onClose} dismissible>
        <p>Your file couldn't be uploaded because it had the wrong format.</p>
      </Alert>
    );
  } else if (props.show === 'success') {
    return (
      <Alert variant="success" onClose={props.onClose} dismissible>
        <p>Your file was uploaded successfully!</p>
      </Alert>
    );
  }
  return null;
}

export default FileAlert;