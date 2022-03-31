import { getNotes } from './functions.js';
import React, { useState } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import StatusButtons from './StatusButtons'


function ListViewItem(props) {
  const [checked, setChecked] = useState([props.checked]);
  const handleChange = (selectedValue) => {
    let newValue = selectedValue.filter(v => !checked.includes(v)); // gets all the classes from the selected value list that are not currently in the checked list (NOTE: is list)
    if (newValue.length === 1) {
      if (newValue[0] == 'Taken') {
        props.takenFunc();
      } else {
        props.plannedFunc();
      }
    }
    setChecked(newValue); 
  }

  return (
    <tr>
      <td className="courses">
        <StatusButtons checked={checked} handleButtonChange={handleChange} uniqueKey={props.uniqueKey}></StatusButtons>
                
        {/* shorthand if-else statement::: if condition ? output true statement : output false statement */}
        {props.Id ? props.Id : " "} {props.Name ? props.Name : " "}</td>
      <td className="credits">{props.Credits ? props.Credits.slice(0, 1) : " "}</td>
      <td className="notes">{props.Prereqs ? getNotes(props.Prereqs) : " "}</td>
    </tr>
  );
}

export default ListViewItem;