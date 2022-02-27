import './App.css';
import ListView from './ListView.jsx';
import FlowChart from './FlowChart.jsx';
import AddCustomClass from './CustomClassModal.jsx';
import FileAlert from './FileAlert.jsx';
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import saveAs from 'file-saver';
import Dropzone from 'react-dropzone';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Display: 'Flow',
      Categories: {},
      Classes: [],
      Class_Desc: {},
      Taken_Classes: [],
      CurPreReqs: [], 
      Colors: {},
      displayAll: false
    };
    // https://stackoverflow.com/questions/64420345/how-to-click-on-a-ref-in-react
    this.fileUploader = React.createRef(); // ref to upload file dialog
    //this.onAddClassSubmit = this.onAddClassSubmit.bind(this, newClassObj);
  }

  /*** when component mounts, load data from json, set state with information ***/
  componentDidMount() { // runs when component loads
    fetch('csreqs.json') // get file at csreqs.json asyncronously
      .then(response => response.text())
      .then(json => JSON.parse(json))
      .then(data => this.setState(data)) // set state information
      .catch(e => console.error('Couldn\'t read json file. The error was:\n', e)); // print any errors
  }

  onAddClassSubmit = (newClassObj) => {
    console.log("onClassSubmit", newClassObj);
    console.log(this.state.Class_Desc);

    // fix name format by just taking class category and number
    let nameParts = newClassObj.Name.match(/([A-Z]{4})(.*)([\d]{4})/);
    newClassObj.Name = nameParts[1] + ' ' + nameParts[3];
    console.log(newClassObj.Name);

    if(newClassObj.Name in this.state.Class_Desc){
      alert("Class already exists!");
      return
    }
    
    let newClassDesc = {...this.state.Class_Desc, [newClassObj.Name]: newClassObj};
    let newClasses = this.addClassToFlowchart(this.state.Classes, newClassObj.Name, newClassObj.Fulfills);

    this.setState({ Class_Desc: newClassDesc, Taken_Classes: [...this.state.Taken_Classes, newClassObj.Name] });

    
  }

  /*** function for handling a click on one of the top navbar links ***/
  menuClick(i) {
    if (i === 0) { // if the first button is clicked
      this.setState({ Display: 'Flow' });
    } else if (i === 1 & !this.state.Display.startsWith('Edit')) { // if the second button is clicked
      this.setState({ Display: 'Edit' });
    } else if (i === 2) { //if first submenu of second button is clicked
      this.setState({ Display: 'EditGenEd' });
    } else if (i == 3) { //if second submenu of second button is clicked
      this.setState({ Display: 'EditCS' });
    }
  }

  /*** function for reading an uploaded file and parsing it to JSON ***/
  onUploadFile(files) {
    let reader = new FileReader();
    // when reader reads a file
    reader.onload = (e) => {
      try {
        let newTakenClasses = JSON.parse(e.target.result).Taken_Classes; // parse upload file
        let newClasses = this.state.Classes.slice();
        for (let clId of newTakenClasses) {
          newClasses = this.addClassToFlowchart(newClasses, clId);
        }
        this.setState({
          Taken_Classes: newTakenClasses,
          Classes: newClasses,
          showAlert: 'success'
        }); // populate classes, display alert
      } catch (err) { // if error during parsing to json or setting state
        console.log(err); // print to console for debugging
        this.setState({ showAlert: 'error' }); // show dismissable alert
      }
    };
    reader.readAsText(files[0]); // make reader read the first file uploaded
  }

  /*** function for saving information from application to a json file
   * make sure to open the webpage into a new tab to test save click functionality ***/
  saveClick() {
    // adapted from answer to https://stackoverflow.com/questions/45941684/save-submitted-form-values-in-a-json-file-using-react
    const fileData = JSON.stringify({ 'Version': '1.0', 'Taken_Classes': this.state.Taken_Classes });
    const blob = new Blob([fileData], { type: "application/json" });
    saveAs(blob, "CUrPLAN");
  }
  
  /*** Calculates amount of credit hours that are needed for a list of flowchart classes
   * And the total number of credit hours that have been taken from the classes
   * Takes: list of flowchart classes ***/
  calculateSemHours(classList) {
    let [total, taken] = [0, 0];
    for (let cl of classList) {
      total += parseInt(cl.Credits);
      if (this.state.Taken_Classes.includes(cl.Name)) { // if have taken, add to count
        taken += parseInt(this.state.Class_Desc[cl.Name].Credits);
      }
    }
    return [taken, total];
  }

  /*** function for replacing a non-specific flowchart box with the new specific id of a class ***/
  addClassToFlowchart(origClasses, classID, category) {
    //to update a state, need to copy contents (using slice) into a new variable, modify the state in that new variable, then set the state (needed because of react's rendering requirements)
    let newClasses = origClasses.slice();
    // for science credit to update properly, add an additional class to the flowchart if biology or chemistry path was taken
    if (classID.startsWith('BIOL') || classID.startsWith('CHEM')) {
      newClasses = [...this.state.Classes, {
        "Name": "Science",
        "Credits": "1-2 hours",
        "Semester": "Spring-2",
        "Color": "SCIENCE"
      }];
    }
    if ('FC_Name' in this.state.Categories[category]) {
      for (let fc_name of this.state.Categories[category].FC_Name) {
        // tries to find a flowchart box that thic class can fill
        let index = this.state.Classes.findIndex(c => c.Name === fc_name);
        if (index >= 0) {
          // creates a duplicate of the classes list & modifies info to have this class instead
          newClasses[index].Type = newClasses[index].Name; // adds element to remember the category
          newClasses[index].Name = classID;
          break;
        }
      }
    }
    return newClasses;
  }
  
  /*** remove a class when you unclick the toggle button ***/
  removeClassFromFlowchart(classID) {
    // finds the class and replaces the information with old category again (when you unclick the class)
    let index = this.state.Classes.findIndex(cl => cl.Name === classID);
    if ('Type' in this.state.Classes[index]) {
      let newClasses = this.state.Classes.slice();
      newClasses[index].Name = newClasses[index].Type; // .Type is the old category
      this.setState({ Classes: newClasses });
    }
  }

  /*** function for handling a click on a checkbox ***/
  checkboxClick(classID) {
    // create a copy of the taken classes (for re-rendering purposes in React)
    if (this.state.Taken_Classes.indexOf(classID) > -1) { // if class is already in taken list
      // removes classid from taken classes list by creating a new list that does not include that classID
      this.setState({ Taken_Classes: this.state.Taken_Classes.filter(c => c !== classID) });
      this.removeClassFromFlowchart(classID);
    } else {
      // sets state to be the list of previously selected taken classes, with the addition of the new classID
      // ... is the spread operator, it makes the elements into elements of the new array
      this.setState({Taken_Classes: [...this.state.Taken_Classes, classID],
      Classes: this.addClassToFlowchart(this.state.Classes, classID, this.state.Class_Desc[classID].Fulfills)
      });
    }
  }

  // ********function that handles creating the edit view and list view components, with the json info that needs to be displayed***********
  displayEditView(displayChoice) {
    // create new list of class descriptions with functions and whether or not the box should be checked for passing to the list view
    let newClassDesc = Object.entries(this.state.Class_Desc).map(([courseID, item]) => ({
      ...item,
      Id: courseID,
      changeFunc: () => this.checkboxClick(courseID), // pass function to component: https://reactjs.org/docs/faq-functions.html
      checked: this.state.Taken_Classes.includes(courseID) // variable used to keep boxes checked when switch between views
    }));
    return (        
      <ListView
        displayChoice={this.state.Display}
        Class_Desc={newClassDesc}
        Categories={this.state.Categories}>
      </ListView>
    );
  }

  // function that handles the content from the json file that should be displayed, and labels the semesters accordingly
  displayFlowChart() {
    let classInfo = this.state.Classes.map(cl => ({
      ...cl,
      cl: this.state.Class_Desc[cl.Name],
      displayAll: this.state.displayAll,
      bgCol: this.state.Colors[cl.Color],
      taken: this.state.Taken_Classes.includes(cl.Name)
    }));
    return (
      <FlowChart 
        Classes={classInfo} 
        ColorOrder={this.state.Color_Order}
        Colors={this.state.Colors}>
      </FlowChart>
    );
  }
  
  // render function under App class is used to tell application to display content
  render() {

    console.log("this.state:");
    console.log(this.state);
  
    let content; // variable to store the content to render
    // set content to display based on which tab the user is currently in (the mode they currently see)
    let display = this.state.Display;
    if (display === 'Flow') {
      content = this.displayFlowChart();
    } else {
      content = this.displayEditView(display);
    } 
    // this return function in the render function will display the content
    // it creates the html code for the navbars and basic layout of the page
    // the {content} segment indicates that the html code from the variable above should be inserted
    // react bootstrap nav dropdown menu link: https://react-bootstrap.github.io/components/dropdowns/
    return (
      <div className="App">
        <FileAlert 
          show={this.state.showAlert} 
          onClose={() => this.setState({ showAlert: '' })}>
        </FileAlert>
        <Navbar variant='dark' bg='dark' sticky='top'>
          <Navbar.Brand>CUrPLAN</Navbar.Brand>
          <Nav>
            <Nav.Link
              className={(this.state.Display === 'Flow') ? 'active' : 'inactive'}
              onClick={() => this.menuClick(0)}
            >Flowchart</Nav.Link>
            <NavDropdown
              className={((this.state.Display.startsWith('Edit')) ? 'active' : 'inactive')}
              onClick={() => this.menuClick(1)}
              title="Edit Classes" id="basic-nav-dropdown"
              menuVariant="dark"
              align="end"
            >
              <NavDropdown.Item
              onClick={() => this.menuClick(2)}>General Ed Classes</NavDropdown.Item>
              <NavDropdown.Item
              onClick={() => this.menuClick(3)}>Computer Science BS</NavDropdown.Item>
            </NavDropdown>
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
        <div className="credit-count">{this.calculateSemHours(this.state.Classes).join(' / ') + ' taken credits'}</div>
        <div className = "flow-warn">
          *3000 & 4000 level CSCI courses are semester dependent. Courses may be offered more frequently as resources allow, but students cannot expect them to be
offered off‐semester. Students should use the rotation shown on this flowchart as a guide for planning their upper level courses.
        </div>
        <AddCustomClass 
          onSubmit={this.onAddClassSubmit} 
          CategoryOpts={Object.keys(this.state.Categories).filter(k => 'FC_Name' in this.state.Categories[k])} // gets category names that can fill in multiple boxes on the flowchart
        />
        {content}
        <Navbar variant='dark' bg='dark' fixed='bottom'>
          <div>
            <input
              ref={this.fileUploader}
              id="uploadFileButton"
              accept=".json" type="file"
              onClick={(e) => { e.target.value = '' }} // ensures uploading file with same name is done
              onChange={(e) => this.onUploadFile(e.target.files)} />
            <Button variant="outline-primary" id="upload-button"
              onClick={() => this.fileUploader.current.click()}>Upload</Button>
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
