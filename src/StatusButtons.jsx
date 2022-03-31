import React from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

function StatusButtons(props) {
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