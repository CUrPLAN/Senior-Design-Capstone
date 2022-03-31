import React from 'react';
import { getNotes, isDarkBackground } from './functions';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

function FlowChartItem(props) {
  // each element for the class description is separated into its own section for future modifications/styling 

  // If the class is in the taken classes add class to signal that
  // The spaces in after each class name ensure that multiple classes can be distinguished for styling
  return (
    // overlay trigger will display additional description about the class once it is clicked
    // The overlay trigger is wrapped around the content/div area that should be clicked to activate the pop up window, 
    // root close means that the other pop up will hide when the user clicks somewhere else outside of the box
    // Overlay Reference: https://react-bootstrap.github.io/components/overlays/
    <OverlayTrigger trigger="click" rootClose={true} placement="auto" overlay={
      <Popover id={"popover" + props.Name}>
        <Popover.Header as="h3">{props.Name}</Popover.Header>
        <Popover.Body>
          <p className="popover-fulfills">{!!props.cl && props.cl.Fulfills}</p>
          {!!props.cl && props.cl.Desc}
        </Popover.Body>
      </Popover>}>
      <div style={{
        backgroundColor: props.bgCol,
        color: isDarkBackground(props.bgCol) ? "#000000" : "#ffffff"
      }}
        className={'flow-box ' + (props.planned ? 'planned-class' : '') +
          (props.taken ? 'taken-class' : '') + (props.isPreReq ? ' pre-reqs' : '')}
        onMouseEnter={props.enterFunc /* calls change function passed as property when checkbox is toggled*/}
        onMouseLeave={props.leaveFunc}>
        <div className='flow-id'>{props.Name}</div>
        <div className='flow-credits'>{props.Credits}</div>
        <div className={props.displayAll ? '' : 'flow-desc'}>
          {/* !!props.cl && props.cl.(key) checks that if the element is not null 
          and if it is not, then displays this element property (conditional rendering) */}
          <div className='flow-name'>{!!props.cl && props.cl.Name}</div>
          <div className='flow-restriction'>{!!props.Restriction && '*' + props.Restriction + '*'}</div>
          <div className='flow-notes'>{!!props.cl && getNotes(props.cl.Prereqs)}</div>
        </div>
      </div>
    </OverlayTrigger>
  );
}

export default FlowChartItem;