import React from 'react';
import Alert from 'react-bootstrap/Alert';

/*** very simple dismissable alert ***/
function DismissableAlert(props) {
  if (props.show) { // if need to show alert, then display it
    // pass properties to alert & function to close (change state in App.jsx)
    return (
      <Alert variant={props.type} onClose={props.onClose} dismissible>
        <p>{props.show}</p>
      </Alert>
    );
  }
  return null;
}

export default DismissableAlert;
