import './App.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import saveAs from 'file-saver';
import Dropzone from 'react-dropzone';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { useState } from "react";


// adapted from https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
// call groupby(list to group, function which takes one argument which will be called on each element of the list to determine groups)
var groupBy = function(xs, func) {
  return xs.reduce(function(rv, x) {
    (rv[func(x)] = rv[func(x)] || []).push(x);
    return rv;
  }, {});
};

var getNotes = function(oldPrereqs) {
  let prereqs = oldPrereqs.slice();
  if (!(typeof prereqs == 'undefined') && (prereqs.length > 0)) {
    let lastSubject = prereqs[0].slice(0,4);
    for (let i = 1; i < prereqs.length; i++) {
      if (prereqs[i].slice(0,4) == lastSubject) {
        prereqs[i] = prereqs[i].slice(5,);
      } else {
        lastSubject = prereqs[i].slice(0,4);
      }
    }
    return 'Prereqs: ' + prereqs.join(' & ');
  } else {
    return "";
  }
}

var isDarkBackground = function(bgCol) {
  // let RGB is a variable that dynamically sets the color of each box and calculates the brightness of the color. based on the color, we set it so that the text color will be black or white based on the brightness of the box color
    let bgRGB = bgCol.slice(1).match(/.{1,2}/g).map(x => Number.parseInt(x, 16));
    return (bgRGB[0]*0.299 + bgRGB[1]*0.587 + bgRGB[2]*0.114) > 186;
}

class ListViewItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td className="courses">
          <InputGroup className='class-checkbox'>
            <InputGroup.Checkbox
              aria-label="Checkbox for class"
              onChange={this.props.changeFunc /* calls change function passed as property when checkbox is toggled*/}
              checked={this.props.checked /* sets checkboxes as checked based on property passed */}
            />
          </InputGroup>{/*this is a shorthand if else statement ? :; if condition ? output true statement : output false statement */}
            {this.props.Id ? this.props.Id : " "} {this.props.Name ? this.props.Name : " "}</td>
        <td className="credits">{this.props.Credits ? this.props.Credits.slice(0,1) : " "}</td>
        {/*<td className="notes">{this.props.Notes ? this.props.Notes : " "}</td>*/}
        <td className="notes">{this.props.Prereqs ? getNotes(this.props.Prereqs) : " "}</td>
      </tr>
    );
  }
}

class FlowChartItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // each element for the class description is separated into its own section for future modifications/styling 

    // If the class is in the taken classes add class to signal that
    // need spaces so that if there are different css styling elements that need to be applied, that the className property can differentiate from them
    return (
      // overlay trigger will display additional description about the class once it is clicked. The overlay trigger is wrapped around the content/div area that should be clicked to activate the pop up window, root close means that the other pop up will hide when the user clicks somewhere else outside of the box
      // Overlay Reference: https://react-bootstrap.github.io/components/overlays/
      <OverlayTrigger trigger="click" rootClose={true} placement="auto" overlay={
        <Popover id={"popover" + this.props.Name}>
          <Popover.Header as="h3">{this.props.Name}</Popover.Header>
          <Popover.Body>
            {!!this.props.cl && /(.*):(.*)/.exec(this.props.cl.Desc)[0]}
          </Popover.Body>
        </Popover>}>
        <div style={{backgroundColor: this.props.bgCol, color: isDarkBackground(this.props.bgCol) ? "#000000" : "#ffffff"}} 
        className={'flow-box ' + 
        (this.props.taken ? ' taken-class' : '') + (this.props.isPreReq ? ' pre-reqs' : '')}
        onMouseEnter={this.props.enterFunc /* calls change function passed as property when checkbox is toggled*/}
        onMouseLeave={this.props.leaveFunc}>
          <div className='flow-id'>{this.props.Name}</div>
          <div className='flow-credits'>{this.props.Credits}</div>
          <div className={this.props.displayAll ? '': 'flow-desc'}>
            {/* !!this.props.cl && this.props.cl.(key) checks that if the element is not null then display this element property (conditional rendering) */}
            <div className='flow-name'>{!!this.props.cl && this.props.cl.Name}</div>
            <div className='flow-restriction'>{!!this.props.Restriction && '*' + this.props.Restriction + '*'}</div>
            <div className='flow-notes'>{!!this.props.cl && getNotes(this.props.cl.Prereqs)}</div>
          </div>
        </div>
      </OverlayTrigger>
    );
  }
}

function AddCustomClass() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
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
          <Form.Group>
              <Form.Label>Class Name: </Form.Label>
              <Form.Control id='className' placeholder="Ex. CSCI 1001"/>
            <Form.Label>Credit Amount: </Form.Label>
              <Form.Control id='creditNum' placeholder="Ex. 3"/>
            <Form.Label>Year: </Form.Label>
              <Form.Control id='classYear' placeholder="Ex. 1"/>
            <Form.Label>Semester: </Form.Label>
              <Form.Control id='classSemester' placeholder="Ex. Fall"/>
            <Form.Label>Class Category</Form.Label>
            <DropdownButton id="dropdown-basic-button" variant="dark" title="Select">
              <Dropdown.Item href="#/action-1">CS BREADTH</Dropdown.Item>
              <Dropdown.Item href="#/action-2">CS ELECTIVE</Dropdown.Item>
              <Dropdown.Item href="#/action-3">ENGR</Dropdown.Item>
              <Dropdown.Item href="#/action-4">MATH</Dropdown.Item>
              <Dropdown.Item href="#/action-5">SCIENCE</Dropdown.Item>
              <Dropdown.Item href="#/action-6">GEN ED CORE</Dropdown.Item>
            </DropdownButton> 
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="dark" onClick={handleClose}>
            Add Class
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Display: 'Flow',
      Classes: [],
      Class_Desc: [],
      Taken_Classes: [],
      CurPreReqs: [], 
      Colors: {},
      displayAll: false
    };
  }

  // load data from json, set state with information
  componentDidMount() { // runs when component loads
    fetch('csreqs.json') // get file at csreqs.json asyncronously
      .then(response => response.text())
      .then(json => JSON.parse(json))
      .then(data => this.setState(data)) // set state information
      .catch(e => console.error('Couldn\'t read json file. The error was:\n', e)); // print any errors
  }

  // function for handling a click on one of the top navbar links
  menuClick(i) {
    if (i === 0) { // if the first button is clicked
      this.setState({ Display: 'Flow' });
    } else if (i === 1) { // if the second button is clicked
      this.setState({ Display: 'Edit' });
    }
  }

  addClassToCategory(classId, classCredits, category) {
    this.state.Categories[category].Credits -= Number.parseInt(classCredits.slice(0,1));
    if ('FC_Name' in this.state.Categories[category]) {
      let index = this.state.Classes.findIndex(c => c.Name === this.state.Categories[category].FC_Name);
      let newClasses = this.state.Classes.slice();
      newClasses[index].Type = newClasses[index].Name;
      newClasses[index].Name = classId;
      this.setState({ Classes: newClasses });
    }
  }

  removeClassFromCategory(classId, classCredits, category) {
    this.state.Categories[category].Credits += Number.parseInt(classCredits.slice(0,1));
    let index = this.state.Classes.findIndex(cl => cl.Name === classId);
    if ('Type' in this.state.Classes[index]) {
      let newClasses = this.state.Classes.slice();
      newClasses[index].Name = newClasses[index].Type;
      this.setState({ Classes: newClasses });
    }
  }

  // function for handling a click on a checkbox
  checkboxClick(classID) {
    // create a copy of the taken classes (for re-rendering purposes in React)
    if (this.state.Taken_Classes.indexOf(classID) > -1) { // if class is already in taken list
      // removes classid from taken classes list by creating a new list that does not include that classID
      this.setState({ Taken_Classes: this.state.Taken_Classes.filter(c => c !== classID) });
      let cl = this.state.Class_Desc[classID];
      if ('Classes' in this.state.Categories[cl.Fulfills] && this.state.Categories[cl.Fulfills].Classes.indexOf(classID) > -1) {
        this.state.Categories[cl.Fulfills].Classes = this.state.Categories[cl.Fulfills].Classes.filter(c => c !== classID);
        if ('Fallback_Cat' in this.state.Categories[cl.Fulfills]) {
          this.removeClassFromCategory(classID, cl.Credits, this.state.Categories[cl.Fulfills].Fallback_Cat);
        }
      } else {
        this.removeClassFromCategory(classID, cl.Credits, cl.Fulfills);
        if ('Classes' in this.state.Categories[cl.Fulfills] && this.state.Categories[cl.Fulfills].Classes.length > 0) {
          let newClassId = this.state.Categories[cl.Fulfills].Classes[0];
          cl = this.state.Class_Desc[newClassId];
          this.state.Categories[cl.Fulfills].Classes = this.state.Categories[cl.Fulfills].Classes.filter(c => c !== newClassId);
          if ('Fallback_Cat' in this.state.Categories[cl.Fulfills]) {
            this.removeClassFromCategory(newClassId, cl.Credits, this.state.Categories[cl.Fulfills].Fallback_Cat);
          }
          if (this.state.Categories[cl.Fulfills].Credits > 0) {
            this.addClassToCategory(newClassId, cl.Credits, cl.Fulfills);
          } else {
            this.state.Categories[cl.Fulfills].Classes = ('Classes' in this.state.Categories[cl.Fulfills]) ? [...this.state.Categories[cl.Fulfills].Classes, newClassId] : [newClassId];
            if ('Fallback_Cat' in this.state.Categories[cl.Fulfills]) {
              this.addClassToCategory(newClassId, cl.Credits, this.state.Categories[cl.Fulfills].Fallback_Cat);
            }
          }
        }
      }
    } else {
      // sets state to be the list of previously selected taken classes, with the addition of the new classID
      // ... is the spread operator, it makes the elements into elements of the new array
      this.setState({Taken_Classes: [...this.state.Taken_Classes, classID]});
      let cl = this.state.Class_Desc[classID];
      if (this.state.Categories[cl.Fulfills].Credits > 0) {
        this.addClassToCategory(classID, cl.Credits, cl.Fulfills);
      } else {
        this.state.Categories[cl.Fulfills].Classes = ('Classes' in this.state.Categories[cl.Fulfills]) ? [...this.state.Categories[cl.Fulfills].Classes, classID] : [classID];
        if ('Fallback_Cat' in this.state.Categories[cl.Fulfills]) {
          this.addClassToCategory(classID, cl.Credits, this.state.Categories[cl.Fulfills].Fallback_Cat);
        }
      }
    }
  }

// this function handles the reading of the uploaded file and parses it to JSON for further use
 onUploadFile(files){
    let reader = new FileReader();
    // when reader reads a file
    reader.onload = (e) => {
      console.log("reader results", reader.result);
      try {
        this.setState({ Taken_Classes: JSON.parse(e.target.result) }); // populate Taken_Classes with parsed upload file
      } catch (err) { // if error during parsing to json or setting state
        console.log(err); // print to console for debugging
        alert("File is not a valid json file"); // alert
      }
    };
    // make reader read the first file uploaded
    reader.readAsText(files[0]);
  }

  // this function handles the functionality of the upload button itself so the user can choose a file to upload
  onClickUpload() {
    document.getElementById('uploadFileButton').click();
  }

  // when begin hovering over box, get prereqs and put in state
  flowBoxEnter(classId) {
    if ((classId in this.state.Class_Desc) && ('Prereqs' in this.state.Class_Desc[classId])) {
      this.setState({ CurPreReqs: this.state.Class_Desc[classId].Prereqs });
    }
  }

  // IF WE WANNA DO THIS:
  // recursive function to get all prerequisites of a class
  getPrereqs(clId) {
    // check if information and property exist
    if ((clId in this.state.Class_Desc) && ('Prereqs' in this.state.Class_Desc[clId])) {
      // make array of the current prereqs
      let prereqarr = this.state.Class_Desc[clId].Prereqs;
      let newprereq = prereqarr.slice(); // make a copy for adding to (else we infinite loop)
      // for each prereq, add all of its prereqs that aren't in the list already
      for (let preCl of prereqarr) {
        if (preCl != clId) { // prevent infinite self referencing loops
          newprereq = newprereq.concat(this.getPrereqs(preCl).filter(x => newprereq.indexOf(x) < 0));
        }
      }
      return newprereq;
    }
    return []; // if no class or no information, return no prereqs
  }

  // when end hovering over box, clear prereqs list from state
  flowBoxLeave() {
    this.setState({ CurPreReqs: [] });
  }

  //make sure to open the webpage into a new tab to test save click functionality
  saveClick() {
    // adapted from answer to https://stackoverflow.com/questions/45941684/save-submitted-form-values-in-a-json-file-using-react
    const fileData = JSON.stringify(this.state.Taken_Classes);
    const blob = new Blob([fileData], {type: "application/json"});
    saveAs(blob, "CUrPLAN");
  }

  // function that handles creating the edit view and list view components, with the json info that needs to be displayed
  displayEditView() {
    let headerList = groupBy(Object.entries(this.state.Class_Desc), x => x[1].Fulfills);
    return (
      <React.Fragment>
      <div className="credit-count">{this.calculateSemHours(this.state.Classes)}</div>
      <table className='listview-table'>
        <thead>
          <tr>
            <th className='courses'>Courses</th>
            <th className='credits'>Credits</th>
            <th className='notes'>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="3" className="alert-td">* Course prerequisites change regularly. 
            Students are responsible for consulting advisors and the class schedule in the student portal for prerequisite information. *</td>
          </tr>

          <tr>
            <td className="heading-courses-td">Required CU Denver Core Curriculum Coursework</td>
            <td className="heading-credits-td">24</td>
            <td><a href="https://catalog.ucdenver.edu/cu-denver/undergraduate/graduation-undergraduate-core-requirements/cu-denver-core-curriculum/">
              See CU Denver Core Curriculum here</a></td>
          </tr>

          { // convert list of headers and courses to appropriate table rows
            Object.entries(headerList).map(([header, courses]) => (
              <React.Fragment key={'section' + header}>
                <tr>
                  <td className="heading-courses-td">{header}</td>
                  {/* get needed credits for section by looking in object */}
                  <td className="heading-credits-td">{this.state.Categories[header].Credits}</td>
                  <td className="heading-notes-td"></td>
                </tr>
                { /* pass all properties of a course to the list view item to get the html code */
                  courses.map(([courseId, course]) => (<ListViewItem
                    key={'course' + courseId}
                    Id={courseId}
                    {...course} // pass elements of a course as properties to the ListViewItem
                    // () => is a way to bind functions when needing to pass functions to another component
                    changeFunc={() => this.checkboxClick(courseId)} // pass function to component: https://reactjs.org/docs/faq-functions.html
                    checked={this.state.Taken_Classes.indexOf(courseId) > -1} // variable used to keep boxes checked when switch between views
                  ></ListViewItem>))}
              </React.Fragment>
            ))}
        </tbody>
      </table>
      </React.Fragment>
    );
  }

  // takes list of flowchart class information, calculates the total amount of credit hours taken from it and the total number of credit hours that are in the classes
  calculateSemHours(classList) {
      let total = 0;
      let taken = 0;
      for (let cl of classList) {
        total += parseInt(cl.Credits.slice(cl.Credits.indexOf('‐') + 1)); 
        if (this.state.Taken_Classes.indexOf(cl.Name) > -1) { // if have taken, add to count
            taken += parseInt(cl.Credits);
        }
      }
      return taken + ' / ' + total + " credits taken"; // return string for display
  }

  // function that handles the content from the json file that should be displayed, and labels the semesters accordingly
  displayFlowChart() {
    // get classes grouped by semester (using global function)
    let semClasses = groupBy(this.state.Classes, x => x.Semester);
    // get classes grouped by semester to be grouped by year
    let yearSems = groupBy(Object.entries(semClasses), x => x[0].split('-')[1]);
    // create all of the html code for the years by mapping each entry to the code
    // uses map to loop and extract year number in 'year' and list of semesters in 'sems'
    let content = Object.entries(yearSems).map(([year, sems]) => (
      // makes new column for each year with table inside for semesters
      <Col key={'colyear' + year} lg={3} sm={6} xs={12} className='yearcol'>
        <Container>
          <Row><Col className='year-header'>Year {year}</Col></Row>
          <Row className='sem-classes'>{
            // sort the semesters alphabetically, so that Fall always comes before Spring
            // uses map to loop and extract semester string in 'sem' and list of classes in 'classes'
            sems.sort((a, b) => a[0].localeCompare(b[0])).map(([sem, classes]) => (
              <Col key={sem} md={6} xs={6} className='semcol'>
                {/* Col: column tag, imported from bootstrap-react 
                  key attribute is used as a unique identifier for an item in a list in react */}
                <div className='sem-header'>{sem.split('-')[0]}</div>
                <div className='sem-credits'>{this.calculateSemHours(classes)}</div>
                {classes.sort((a, b) =>
                  // sort by color order 
                  this.state.Color_Order.indexOf(a.Color) - this.state.Color_Order.indexOf(b.Color)
                ).map((cl, i) => (
                  // FlowchartItem tag will contain the information about the class (what class you are taking that semester will be displayed)
                  <FlowChartItem
                    key={sem + 'class' + i}
                    {...cl}
                    cl={this.state.Class_Desc[cl.Name]}
                    bgCol={this.state.Colors[cl.Color]}
                    displayAll={this.state.displayAll}
                    enterFunc={() => this.flowBoxEnter(cl.Name)}
                    leaveFunc={() => this.flowBoxLeave()}
                    isPreReq={this.state.CurPreReqs.indexOf(cl.Name) > -1}
                    taken={this.state.Taken_Classes.indexOf(cl.Name) > -1 /* use indexOf to get the index of the element in the list, if not in the list it returns -1*/}
                  ></FlowChartItem>))}
              </Col>))
          }</Row>
        </Container>
      </Col>));

      let legendNames = this.state.Colors;
      console.log(legendNames);

      let legend = Object.entries(legendNames).sort((a, b) => this.state.Color_Order.indexOf(a[0]) - this.state.Color_Order.indexOf(b[0])).map(([name, color]) => ( 
        <div 
          key={'legend'+name}
          className="flow-box-legend" 
          style={{backgroundColor: color, color: isDarkBackground(color) ? "#000000" : "#ffffff"}}>
          {name}
        </div>
      ));
      // console.log(legend);
      
    // the display flowchart function will return the html for entire flowchart
    // since the html code is stored in a variable, the curly brackets are used to denote that the html code in the object should be inserted at this spot    
    return (
      <Container fluid id='flowchart'>
        <Row>
          {content}
          <div className="flow-legend">
            <div className="legend-title">
              Legend
            </div>
            {legend}
          </div>
        </Row>
      </Container>
    );
  }
  
  // render function under App class is used to tell application to display content
  render() {

    console.log("this.state:");
    console.log(this.state);
  
    let content; // variable to store the content to render
    // set content to display based on which tab the user is currently in (the mode they currently see)
    if (this.state.Display === 'Edit') {
      content = this.displayEditView();
    } else {
      content = this.displayFlowChart();
    }

    // this return function in the render function will display the content
    // it creates the html code for the navbars and basic layout of the page
    // the {content} segment indicates that the html code from the variable above should be inserted
    return (
      <div className="App">
        <Navbar variant='dark' bg='dark' sticky='top'>
          <Navbar.Brand>CUrPLAN</Navbar.Brand>
          <Nav>
            <Nav.Link
              className={(this.state.Display === 'Flow') ? 'active' : 'inactive'}
              onClick={() => this.menuClick(0)}
            >Flowchart</Nav.Link>
            <Nav.Link 
              className={(this.state.Display === 'Edit') ? 'active' : 'inactive'}
              onClick={() => this.menuClick(1)}
            >Edit Classes</Nav.Link>
          </Nav>
        </Navbar>
        <div className='expand'>
        <InputGroup className='class-checkbox'>
          <InputGroup.Checkbox
            aria-label="Expand All Details"
            onChange={() => this.setState({displayAll: !this.state.displayAll})}
          />
        </InputGroup>
        Expand All Details
        </div>
        <div className = "flow-warn">
          *3000 & 4000 level CSCI courses are semester dependent. Courses may be offered more frequently as resources allow, but students cannot expect them to be
offered off‐semester. Students should use the rotation shown on this flowchart as a guide for planning their upper level courses.
        </div>
        <AddCustomClass />
        {content}
        <Navbar variant='dark' bg='dark' fixed='bottom'>
          <div>
            <input id="uploadFileButton" accept=".json" type="file" onChange={(e)=>this.onUploadFile(e.target.files)} />
            <Button variant="outline-primary" id="upload-button" onClick={()=>this.onClickUpload()}>Upload</Button>
          </div>


          <div className="dropzone">
            <Dropzone onDrop={acceptedFiles => this.onUploadFile(acceptedFiles)}>
              {({getRootProps, getInputProps}) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drop your CUrPLAN .json file here</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>

          <Button variant="outline-primary" id="save-button" onClick={() => this.saveClick()}>Save</Button>
          <Button variant="outline-primary" id="print-button" onClick={() => window.print()}>Print</Button>
        </Navbar>
      </div>
    );
  }
}

export default App;
