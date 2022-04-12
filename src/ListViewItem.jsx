import { getNotes } from './functions.js';
import React, { useState } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import StatusButtons from './StatusButtons'

/*** Creates an individual container for each class to display in Edit Classes view ***/
function ListViewItem(props) {
  const [checked, setChecked] = useState([props.checked]); // holds if class is taken or planned
  // function to handle if taken or planned is clicked 
  const handleChange = (selectedValue) => {
    // NOTE: Radio buttons will not allow deselection by clicking on an already selected button, but we only want to allow one button to be clicked. We opted to use checkbox buttons but they allow multiple selection of buttons. To force only one button to be clicked, we just filter out buttons that were clicked previously. We want to represent three options using two checkbox buttons: class is Taken if the Taken button is clicked, class is Planned if the Planned button is clicked, and neither option if both Taken and Planned buttons are unclicked.
    let newValue = selectedValue.filter(v => !checked.includes(v)); // gets all the classes from the selected value list that are not currently in the checked list (NOTE: is list)
    if (newValue.length === 1) { // if a button is selected
      if (newValue[0] == 'Taken') { // call the taken function passed in from App.jsx if its taken
        props.takenFunc();
      } else {
        props.plannedFunc(); // else call the planned function passed in 
      }
    } else { // no button is selected
      if (checked[0] == 'Taken') { // call the taken function passed in from App.jsx if its taken
        props.takenFunc();
      } else {
        props.plannedFunc(); // else call the planned function passed in 
      }
    }
    setChecked(newValue); 
  }

  return (
    <tr>
      <td className="courses">
        <StatusButtons 
          checked={checked} 
          handleButtonChange={handleChange} 
          uniqueKey={props.uniqueKey /* if no unique key is provided, all status buttons will be linked and changing one will change them all */}
        ></StatusButtons>
                
        {/* shorthand if-else statement::: if condition ? output true statement : output false statement */}
        {props.Id ? props.Id : " "} {props.Name ? props.Name : " "}</td>
      <td className="credits">{props.Credits ? props.Credits.slice(0, 1) : " "}</td>
      <td className="notes">{props.Prereqs ? getNotes(props.Prereqs) : " "}</td>
    </tr>
  );
}

export default ListViewItem;