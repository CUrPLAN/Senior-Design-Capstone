import { groupBy, getNotes } from './functions.js';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/*** function that returns if white or black text will have better contrast with the color passed ***/
var isDarkBackground = function (bgCol) {
  // bgRGB gets the parts of the background color in hex format to rgb format
  let bgRGB = bgCol.slice(1).match(/.{1,2}/g).map(x => Number.parseInt(x, 16));
  return (bgRGB[0] * 0.299 + bgRGB[1] * 0.587 + bgRGB[2] * 0.114) > 186; // predefined formula for if a color is dark
}

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
          {!!props.cl && props.cl.Desc}
        </Popover.Body>
      </Popover>}>
      <div style={{
        backgroundColor: props.bgCol,
        color: isDarkBackground(props.bgCol) ? "#000000" : "#ffffff"
      }}
        className={'flow-box ' +
          (props.taken ? ' taken-class' : '') + (props.isPreReq ? ' pre-reqs' : '')}
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

function FlowChart(props) {

  let [curPrereqs, setPrereqs] = useState([]);

  /*** Calculates amount of credit hours that are needed for a list of flowchart classes
   * And the total number of credit hours that have been taken from the classes
   * Takes: list of flowchart classes ***/
  const calculateSemHours = classList => {
    let [total, taken] = [0, 0];
    for (let cl of classList) {
      total += parseInt(cl.Credits);
      taken += cl.taken ? parseInt(cl.cl.Credits) : 0; // if taken add to count
    }
    return [taken, total];
  }

  // convenient function to allow for easy ordering by color (when passed to the sortby function)
  const byColor = (a, b) => props.ColorOrder.indexOf(a) - props.ColorOrder.indexOf(b);

  // maps each color to a div to be displayed 
  let legend = Object.entries(props.Colors).sort((a, b) => byColor(a[0], b[0])).map(([name, color]) => (
    <div
      key={'legend' + name}
      className="flow-box-legend"
      style={{
        backgroundColor: color, 
        color: isDarkBackground(color) ? "#000000" : "#ffffff"
      }}>
      {name}
    </div>
  ));

  // get classes grouped by semester (using global function)
  let semClasses = groupBy(props.Classes, x => x.Semester);
  // get classes grouped by semester to be grouped by year
  let yearSems = groupBy(Object.entries(semClasses), x => x[0].split('-')[1]);
  // returns html for entire flowchart 
  return (
    <Container fluid id='flowchart'>
      <Row>
        {/* the drag-n-drop functionality uses the react beautiful drag-n-drop library and is handled within the DragDropContext tags which calls the handleOnDragEnd function in the App component to update the state. */}
        <DragDropContext onDragEnd={props.onDragEnd}>
        {// create all of the html code for the years by mapping each entry to the code
         //  uses map to loop and extract year number in 'year' and list of semesters in 'sems'
          Object.entries(yearSems).map(([year, sems]) => (
          // makes new column for each year with table inside for semesters
            <Col key={'colyear' + year} lg={3} sm={6} s={12} className='yearcol'>
              <Container>
                <Row><Col className='year-header'>Year {year}</Col></Row>
                <Row className='sem-classes'>{
                  /* sort the semesters alphabetically, so that Fall always comes before Spring
                  uses map to loop and extract semester string in 'sem' and list of classes in 'classes'*/
                  sems.sort((a, b) => a[0].localeCompare(b[0])).map(([sem, classes]) => (
                    <Droppable key={sem} droppableId={sem}>
                      {(provided) => (
                      /* Col: column tag, imported from bootstrap-react 
                      key attribute is used as a unique identifier for an item in a list in react */
                      <Col {...provided.droppableProps} ref={provided.innerRef} md={6} xs={6} className='semcol'>
                      <div className='sem-header'>{sem.split('-')[0]}</div>
                      <div className='sem-credits'>{calculateSemHours(classes).join(' / ') + ' credits taken'}</div>
                      {classes.sort((a,b) => byColor(a.Color, b.Color)).map((cl, i) => (
                        /* used <Droppable> tag to identify area where classes can be placed (surrounded around each semester columns), <Draggable> tag to identify the classes that can be dragged. link to implementing drag and drop: https://www.freecodecamp.org/news/how-to-add-drag-and-drop-in-react-with-react-beautiful-dnd/*/
                        <Draggable key={cl.index.toString()} draggableId={cl.index.toString()} index={i}>
                          {(provided) => (
                            // Draggable ref & properties in div surrounding flowchart item for ref to work
                            // FlowChartItem tag renders a box with all the information about the class
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>   
                              <FlowChartItem 
                                {...cl}
                                isPreReq={curPrereqs.includes(cl.Name)}
                                enterFunc={() => setPrereqs((!!cl.cl && !!cl.cl.Prereqs) ? cl.cl.Prereqs : [])}
                                leaveFunc={() => setPrereqs([])}
                              ></FlowChartItem>
                            </div>
                          )}
                        </Draggable>
                        ))}
                        {/* To keep everything in place when dragging around classes */}
                        {provided.placeholder}
                      </Col>
                    )}
                    </Droppable>
                  ))}</Row>
              </Container>
            </Col>))}
        </DragDropContext>
      </Row>
      <div className="flow-legend">
        {legend}
      </div>
    </Container>
  );
}

export default FlowChart;
