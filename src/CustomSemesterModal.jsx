import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import StatusButtons from './StatusButtons';

/*** Function to create a modal to add a custom class ***/
function AddCustomSemester(props) {
  // setting state using functional react syntax
  const [show, setShow] = useState(false); // show / hide modal itself
  const [semesterYear, setSemesterYear] = useState('');
  const [semesterType, setSemesterType] = useState('');
  const [buttonStatus, setButtonStatus] = useState(true); // if submit button disabled

  useEffect(() => { // runs after every render (state changes) -- adjusts if submit button disabled
    setButtonStatus(!(/^\s*\d+\s*$/.test(semesterYear) && semesterType !== ''));
  });

  // functions that handle open/close
  const handleShow = () => { setShow(true); };
  const handleClose = () => {
    setShow(false);
    // reset all values for the next time the modal is opened
    setButtonStatus(true);
    setSemesterYear('');
    setSemesterType('');
  };
  // function to handle submitting the form (adding a new class)
  const addSemester = () => {
    handleClose(); // close modal on submit
    // pass information for new class to function passed from App.jsx to update state
    props.onSubmit(`${semesterType}-${semesterYear}`); // pass status to onsubmit method
  }

  // create Modal with form
  return (
    <div className="custom-class-button">
      <Button variant="dark" onClick={handleShow}>
        Add Semester
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Semester</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="custom-class-form">
            <Form.Label>Semester:</Form.Label>
              <Form.Select value={semesterType}
                onChange={e => { setSemesterType(e.target.value); }}>
                <option key='defaultoption' value=''>Select a category</option>
                <option key='summeroption' value='Summer'>Summer</option>
                <option key='falloption' value='Fall'>Fall</option>
                <option key='springoption' value='Spring'>Spring</option>
              </Form.Select>
              <Form.Label>Year:</Form.Label>
              <Form.Control
                id='semesterYear'
                placeholder="3"
                onChange={e => { setSemesterYear(e.target.value); }} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button disabled={buttonStatus} variant="dark" onClick={addSemester}>
            Add Semester
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddCustomSemester;