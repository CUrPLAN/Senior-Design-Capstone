import './App.css';
import ListView from './ListView.jsx';
import FlowChart from './FlowChart.jsx';
import AddCustomClass from './CustomClassModal.jsx';
import FileAlert from './FileAlert.jsx';
import DragnDropAlert from './DragnDropAlert.jsx';
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import saveAs from 'file-saver';
import Dropzone from 'react-dropzone';
import Alert from 'react-bootstrap/Alert';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Display: 'Flow',
      Categories: {},
      Classes: [],
      ClassDesc: {},
      TakenClasses: [],
      PlannedClasses: [],
      CurPreReqs: [],
      Colors: {},
      displayAll: false,
      DragnDropAlert: null,
      AddedClasses: [] // store ids of user-added-classes
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

  /*** when user submits new information for a custom class (called by AddCustomClass) ***/
  onAddClassSubmit = (newClassObj, status) => {
    // fix name format by just taking class category and number
    let nameParts = newClassObj.Id.match(/([A-Z]{4})(.*)([\d]{4})/);
    newClassObj.Id = nameParts[1] + ' ' + nameParts[3];

    if (newClassObj.Id in this.state.ClassDesc) {
      alert("Class already exists!");
      return
    }

    // modify objects to include new class
    let newClassDesc = { ...this.state.ClassDesc, [newClassObj.Id]: newClassObj };
    this.setState({
      ClassDesc: newClassDesc,
      AddedClasses: [...this.state.AddedClasses, newClassObj.Id]
    });
    if (status === 'Taken') {
      this.setState({ TakenClasses: [...this.state.TakenClasses, newClassObj.Id] });
    } else {
      this.setState({ PlannedClasses: [...this.state.PlannedClasses, newClassObj.Id] });
    }
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
        let newInfo = JSON.parse(e.target.result); // parse upload file
        let newClasses = this.state.Classes.slice();
        // replace every semester in newClasses with value that was saved in file
        newClasses.forEach((cl, i) => cl.Semester = newInfo.DragNDropSems[i]);
        let newClassDesc = {...this.state.ClassDesc};
        newInfo.AddedClasses.forEach(cl => newClassDesc[cl.Id] = cl);
        this.setState({
          TakenClasses: newInfo.TakenClasses,
          PlannedClasses: newInfo.PlannedClasses,
          Classes: newClasses,
          AddedClasses: newInfo.AddedClasses.map(cl => cl.Id),
          ClassDesc: newClassDesc,
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
    // adapted from answer to 
    // https://stackoverflow.com/questions/45941684/save-submitted-form-values-in-a-json-file-using-react
    const fileData = JSON.stringify({ 
      'Version': '1.0', 
      'TakenClasses': this.state.TakenClasses, 
      'PlannedClasses': this.state.PlannedClasses, 
      'DragNDropSems': this.state.Classes.map(cl => cl.Semester), // get only list of semesters
      'AddedClasses': this.state.AddedClasses.map(id => this.state.ClassDesc[id])
    });
    const blob = new Blob([fileData], { type: "application/json" });
    saveAs(blob, "CUrPLAN");
  }

  /*** Calculates amount of credit hours taken in total
   * And the total number of credit hours that have been taken from the classes
   * Takes: list of flowchart classes ***/
  calculateSemHours() {
    let [total, taken] = [0, 0];
    this.getFlowchartWithClasses().forEach(cl => {
      total += parseInt(cl.Credits);
      if (this.state.TakenClasses.includes(cl.Name)) { // if have taken, add to count
        taken += parseInt(this.state.ClassDesc[cl.Name].Credits);
      }
    });
    return [taken, total];
  }

  /*** replaces a box with fc_name as the name, if it exists, with the classID ***/
  addClassToFlowchart(classes, classID, fc_name) {
    // tries to find a flowchart box that thic class can fill
    let index = classes.findIndex(c => c.Name === fc_name);
    if (index >= 0) {
      classes[index].Name = classID;
    }
  }
  
  /*** adds the path of classes to the flowchart
  Note: this is currently releated to adding the correct science classes 
  TODO: should we do this with the calculation of how many credits needed? 
      push this class directly & remove it if replaced***/
  addPathToFlowchart(classes, path, cat) {
    let fc_name = this.state.Categories[cat].FC_Name[0];
    let newClass;
    // goes through classes in path
    for (let pathID of path) {
      // finds spot where this class can fill
      let index = classes.findIndex(c => c.Name === fc_name || 
        (c.Type === fc_name && !path.includes(c.Name)));
      if (index >= 0) {
        if (!newClass) {
          newClass = {...classes[index]};
          newClass.Credits = 0;
        } 
        classes[index].Type = classes[index].Name;
        classes[index].Name = pathID;
        // note if need credits to fulfill the requirement
        newClass.Credits += parseInt(classes[index].Credits) - parseInt(this.state.ClassDesc[pathID].Credits);
      }
    }
    if (newClass.Credits > 0) {
      newClass.Credits += ' Credits';
      return newClass; // if need additional credits, return new class
    }
  }
  
  getFlowchartWithClasses() {
    let classes = JSON.parse(JSON.stringify(this.state.Classes)); // deep copy object
    let classesToAdd = [];
    let catCreds = {};
    Object.keys(this.state.Categories).forEach(k => catCreds[k] = 0);
    for (let clID of this.state.TakenClasses.concat(this.state.PlannedClasses)) {
      if (classes.findIndex(c => c.Name === clID) === -1) { // if not in flowchart
        let cl = this.state.ClassDesc[clID];
        if ('Path' in cl) {
          // calculate the number of taken credits of the path
          let takenCreds = cl.Path.map(id => 
            this.state.TakenClasses.includes(id) ? parseInt(this.state.ClassDesc[id].Credits) : 0)
            .reduce((a, b) => a + b, 0);
          // if more credits of this path have been taken, replace path with this one
          if (takenCreds > catCreds[cl.Fulfills]) {
            catCreds[cl.Fulfills] = takenCreds;
            let classToAdd = this.addPathToFlowchart(classes, cl.Path, cl.Fulfills);
            classesToAdd = !classToAdd ? [] : [classToAdd];
          }
        } else {
          // add class to flowchart
          let fc_ind = catCreds[cl.Fulfills] >= this.state.Categories[cl.Fulfills].Credits ? 1 : 0;
          this.addClassToFlowchart(classes, clID, this.state.Categories[cl.Fulfills].FC_Name[fc_ind]);
          catCreds[cl.Fulfills] += parseInt(cl.Credits);
        }
      }
    }
    return classes.concat(classesToAdd);
  }

  /*** function for handling a click on a checkbox ***/
  markClassTaken(classID) {
    console.log("mark taken", classID);
    if (this.state.TakenClasses.includes(classID)) { // if class is already in taken list
      // removes classid from taken classes list by creating a new list that does not include that classID
      this.setState({ TakenClasses: this.state.TakenClasses.filter(c => c !== classID) });
    } else {
      // sets state to be the list of previously selected taken classes, with the addition of the new classID
      // ... is the spread operator, it makes the elements into elements of the new array
      this.setState({ TakenClasses: [...this.state.TakenClasses, classID], 
                     PlannedClasses: this.state.PlannedClasses.filter(c => c !== classID)});
    }
  }

  /*** function for handling a click on a checkbox ***/
  markClassPlanned(classID) {
    console.log("mark planned", classID);
    if (this.state.PlannedClasses.includes(classID)) { // if class is already in taken list
      // removes classid from taken classes list by creating a new list that does not include that classID
      this.setState({ PlannedClasses: this.state.PlannedClasses.filter(c => c !== classID) });
    } else {
      // sets state to be the list of previously selected taken classes, with the addition of the new classID
      // ... is the spread operator, it makes the elements into elements of the new array
      this.setState({ PlannedClasses: [...this.state.PlannedClasses, classID],
                    TakenClasses: this.state.TakenClasses.filter(c => c !== classID)});
    }
  }

  /*** creates list/edit view with list of classes to choose ***/
  displayEditView() {
    // create new list of class descriptions with functions 
    // and whether or not the box should be checked for passing to the list view
    let newClassDesc = Object.entries(this.state.ClassDesc).map(([courseID, item]) => ({
      ...item,
      Id: courseID,
      // pass function to component: https://reactjs.org/docs/faq-functions.html
      takenFunc: () => this.markClassTaken(courseID),
      plannedFunc: () => this.markClassPlanned(courseID),
      // variable used to keep boxes checked when switch between views
      checked: this.state.TakenClasses.includes(courseID) ? 'Taken' : (this.state.PlannedClasses.includes(courseID) ? 'Planned' : null)
    }));
    return (
      <ListView
        displayChoice={this.state.Display}
        ClassDesc={newClassDesc}
        Categories={this.state.Categories}>
      </ListView>
    );
  }

  /*** compares two semester strings (ex. Fall-3, Spring-2) 
  returns -1 if sem1 is after sem2, returns 1 if sem1 is before sem2, and returns 0 if they're the same ***/
  compareSemesters(sem1, sem2) {
    //1) classes have same semesters
    if (sem1 === sem2) {
      return 0;
    }
    let [sem1Semester, sem1Year] = sem1.split('-');
    let [sem2Semester, sem2Year] = sem2.split('-');
    //different cases (currently for fall and spring semesters)
    //2) years are different -- if the prereqs year is greater than the destination year
    if (parseInt(sem1Year) > parseInt(sem2Year)) {
      return -1;
    }
    //3) class is dragged to semester before preq -- if its in fall & prereq is in spring of the same year
    if (sem1Year === sem2Year && sem1Semester === 'Spring' && sem2Semester === 'Fall') {
      return -1;
    } 
    return 1;
  }

  /*** handles the drag-n-drop state updates to the flowchart (so things stay in their place) ***/
  handleOnDragEnd = (result) => {
    this.setState( { DragnDropAlert: null } );
    if (!result.destination) return; // bounds checking: make sure doesn't go out of list
    // check for prereqs: (current assumption is that all prereqs are included in the core classes)
    
    let newClasses = this.state.Classes.slice(); // duplicate list for re-rendering

    //obtain the class name of the class being dragged
    let classDragged = newClasses[parseInt(result.draggableId)].Name;

    if (classDragged in this.state.ClassDesc) { // checking that the class that was dragged has an Id      
      //'in' keyword gets the index of the list, 'of' gets the object in the list
      for (let cl of newClasses) { // go through prereqs of class
        if (this.state.ClassDesc[classDragged].Prereqs.includes(cl.Name)) { // if the current class is a prereq of the dragged class
          let output = this.compareSemesters(cl.Semester, result.destination.droppableId); // want current semester to be less than the dragged semester
          if (output != 1) { //if the prereq class semester is before the dragged class semester, no need to update state
            let DnDAlertMsg = `${classDragged} cannot be dragged before or in the same semester as ${cl.Name}.`;
            this.setState( {DragnDropAlert: DnDAlertMsg} );
            return;
          } // if END
        }
        else if (cl.Name in this.state.ClassDesc && this.state.ClassDesc[cl.Name].Prereqs.includes(classDragged)) { // if the class dragged is a prereq of the current class
          let output = this.compareSemesters(cl.Semester, result.destination.droppableId); // want the current semester to be greater than the dragged semester
          if (output != -1) { // if the current semester is not greater than the dragged semester, exit 
            let DnDAlertMsg = `${classDragged} cannot be dragged after or in the same semester as ${cl.Name}.`;
            this.setState( {DragnDropAlert: DnDAlertMsg} );
            return;
          } // if END
        } // else if END
      } // FOR END
      // ensure that classes with fall/spring restrictions aren't dragged to the wrong semesters
      if ('Restriction' in  newClasses[parseInt(result.draggableId)]) {
        let restriction = newClasses[parseInt(result.draggableId)].Restriction.split(' ')[0].toLowerCase(); // 'FALL ONLY'
        if (!result.destination.droppableId.toLowerCase().startsWith(restriction)) { // if destination doesn't start with restricted semester
          let DnDAlertMsg = `${classDragged} cannot be dragged to a ${restriction} semester.`;
          this.setState( { DragnDropAlert: DnDAlertMsg } );
          return;
        }
      }
    } // IF END

    //parsing through new classes to find the class that is being dragged
    newClasses[parseInt(result.draggableId)].Semester = result.destination.droppableId;
    this.setState({ Classes: newClasses });
  } //handleDragEnd function END

  /*** creates flow chart view with all classes ***/
  displayFlowChart() {
    // create new list of classes with all class descriptions needed
    // along with color and whether or not it's been taken
    let classInfo = this.getFlowchartWithClasses().map((cl, i) => ({
      ...cl,
      cl: this.state.ClassDesc[cl.Name],
      displayAll: this.state.displayAll,
      bgCol: this.state.Colors[cl.Color],
      taken: this.state.TakenClasses.includes(cl.Name),
      planned: this.state.PlannedClasses.includes(cl.Name),
      index: i // property for drag and drop
    }));
    // pass handleOnDragEnd for changing state when class dragged
    return (
      <FlowChart
        Classes={classInfo}
        ColorOrder={this.state.ColorOrder}
        Colors={this.state.Colors}
        onDragEnd={this.handleOnDragEnd}> 
      </FlowChart>
    );
  }

  // render function under App class is used to tell application to display content
  render() {
    let content; // variable to store the content to render
    // set content to display based on which tab the user is currently in (the mode they currently see)
    if (this.state.Display === 'Flow') {
      content = this.displayFlowChart();
    } else {
      content = this.displayEditView();
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
        <DragnDropAlert show={this.state.DragnDropAlert} onClose={() => this.setState({ DragnDropAlert: null })}>
          </DragnDropAlert>
        <Navbar variant='dark' bg='dark' sticky='top'>
          <Navbar.Brand>CUrPLAN</Navbar.Brand>
          <Nav>
            <Nav.Link
              className={(this.state.Display === 'Flow') ? 'active' : 'inactive'}
              onClick={() => this.menuClick(0)}>Flowchart</Nav.Link>
            <NavDropdown
              className={((this.state.Display.startsWith('Edit')) ? 'active' : 'inactive')}
              onClick={() => this.menuClick(1)}
              title="Edit Classes" id="basic-nav-dropdown"
              menuVariant="dark"
              align="end">
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
              onChange={() => this.setState({ displayAll: !this.state.displayAll })}
            />
          </InputGroup>
          Expand All Details
        </div>
        <div className="credit-count">{this.calculateSemHours().join(' / ') + ' taken credits'}</div>
        <div className="flow-warn">
          *3000 & 4000 level CSCI courses are semester dependent. Courses may be offered
          more frequently as resources allow, but students cannot expect them to be
          offered off‐semester. Students should use the rotation shown on this flowchart
          as a guide for planning their upper level courses.
        </div>
        <AddCustomClass
          onSubmit={this.onAddClassSubmit}
          // gets category names that can fill in multiple boxes on the flowchart
          CategoryOpts={Object.keys(this.state.Categories).filter(k => 'FC_Name' in this.state.Categories[k])}
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
              {({ getRootProps, getInputProps }) => (
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
