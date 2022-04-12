import React from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

/*** Creates Toggle Buttons for each class (Taken or Planned) in the Edit Classes view ***/
function StatusButtons(props) {
    /* props.uniqueKey is necessary because if no unique key is provided, all status buttons will be linked and changing one will change them all */
    return (
      <ToggleButtonGroup
        className='custom-toggle-buttons'
        type='checkbox' 
        name={'takenOrPlannedSelection' + props.uniqueKey}
        value={props.checked}
        onChange={props.handleButtonChange}
      >
          <ToggleButton
            id={"tbg-btn-1" + props.uniqueKey}
            value = {'Taken'}
            variant = {'outline-success'}
            size="sm"
          >
            Taken
          </ToggleButton>
        <ToggleButton
            id={"tbg-btn-2" + props.uniqueKey}
            value = {'Planned'}
            variant = {'outline-warning'}
            size="sm"
        >
          Planned
        </ToggleButton>
      </ToggleButtonGroup>
  );
}

export default StatusButtons;