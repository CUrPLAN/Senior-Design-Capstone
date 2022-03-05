import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from "react";


function AddCustomClass(props) {
  const [show, setShow] = useState(false);
  const [classNameValue, setClassNameValue] = useState('');
  const [creditNumValue, setCreditNumValue] = useState('');
  const [classCategoryValue, setClassCategoryValue] = useState('');
  const [buttonStatus, setButtonStatus] = useState(true); // if submit button disabled

  useEffect(() => { // runs after every render (state changes) -- adjusts if submit disabled
    setButtonStatus(!(classNameValue.length > 0 && creditNumValue.length > 0
      && /^\d+$/.test(creditNumValue) && /^[A-Z]{4}(.*)[\d]{4}$/.test(classNameValue)
      && classCategoryValue !== ''));
  });

  // functions that handle open/close & submitting
  const handleClose = () => {
    setShow(false);
    setButtonStatus(true);
    setClassNameValue('');
    setCreditNumValue('');
    setClassCategoryValue('');
  };
  const handleShow = () => { setShow(true); };
  const addClass = () => {
    handleClose();
    console.log(classCategoryValue);
    props.onSubmit({
      Name: classNameValue,
      Credits: creditNumValue + " Credits",
      Desc: "",
      Fulfills: classCategoryValue,
      Prereqs: []
    });
  }

  // create Modal with form
  return (
    <div className="custom-class-button">
      <Button variant="dark" onClick={handleShow}>
        Add Custom Class
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Custom Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Class Name:</Form.Label>
              <Form.Control
                id='className'
                placeholder="CSCI 1001"
                onChange={e => { setClassNameValue(e.target.value.toUpperCase()); }} />
              <Form.Label>Credit Amount:</Form.Label>
              <Form.Control
                id='creditNum'
                placeholder="3"
                onChange={e => { setCreditNumValue(e.target.value); }} />
              <Form.Label>Class Category:</Form.Label>
              <Form.Select value={classCategoryValue}
                onChange={e => { setClassCategoryValue(e.target.value); }}>
                <option key='defaultoption' value=''>Select a category</option>
                {props.CategoryOpts.map((opt, i) =>
                  (<option key={'option' + i} value={opt}>{opt}</option>))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button disabled={buttonStatus} variant="dark" onClick={addClass}>
            Add Class
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddCustomClass;