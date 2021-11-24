import './App.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';



// adapted from https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
// call groupby(list to group, function which takes one argument which will be called on each element of the list to determine groups)
var groupBy = function(xs, func) {
  return xs.reduce(function(rv, x) {
    (rv[func(x)] = rv[func(x)] || []).push(x);
    return rv;
  }, {});
};

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
        </InputGroup>{/*this is a shorthand if else statement ? :; if condition ? output true statement : output false statement */}{this.props.Id?this.props.Id: " "} {this.props.Name?this.props.Name: " "}</td>
        <td className="credits">{this.props.Credits?this.props.Credits: " "}</td>
        <td className="notes">{this.props.Notes?this.props.Notes: " "}</td>
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

    // If the class is in the taken classes list modify transparency
    // need spaces so that if there are different css styling elements that need to be applied, that the className property can differentiate from them
    let transparency = ' ';
    if (this.props.taken) {
      transparency = ' taken-class';
    }

    return (
      <div className={'flow-box ' + this.props.Color + transparency}>
        <div className='flow-id'>{this.props.Name}</div>
        <div className='flow-desc'>
          {/* !!this.props.cl && this.props.cl.(key) checks that if the element is not null then display this element property (conditional rendering) */}
          <div className='flow-name'>{!!this.props.cl && this.props.cl.Name}</div>
          <div className='flow-credits'>{this.props.Credits} {this.props.Credits == 1 ? 'hour' : 'hours'}</div>
          <div className='flow-notes'>{!!this.props.cl && this.props.cl.Notes}</div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Display: 'Flow',
      Classes: [],
      Class_Desc: [],
      Taken_Classes: [], // ["CSCI 2942", "CSCI 4892"] < --- only include the classes that have been taken in this list
      UploadedFile: {} // the uploaded file
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
      this.setState({Display: 'Flow'});
    } else if (i === 1) { // if the second button is clicked
      this.setState({Display: 'Edit'});
    }
  }

  // function for handling a click on a checkbox
  checkboxClick(classID) {
    // create a copy of the taken classes (for re-rendering purposes in React)
    if (this.state.Taken_Classes.indexOf(classID) > -1) { // if class is already in taken list
      // removes classid from taken classes list by creating a new list that does not include that classID
      this.setState({Taken_Classes: this.state.Taken_Classes.filter(c => c !== classID)});
    } else {
      // sets state to be the list of previously selected taken classes, with the addition of the new classID
      // ... is the spread operator, it makes the elements into elements of the new array
      this.setState({Taken_Classes: [...this.state.Taken_Classes, classID]});
    }
  }

// this function handles the reading of the uploaded file and parses it to JSON for further use
 onChange(e){
    
    let file = event.target.files[0];
    console.log("file", file);

    if (file) {
      let data = new FormData();
      data.append('file', file)
    }

    let reader = new FileReader();
    console.log("reader", reader)

      reader.onload = (e) => {
        console.log("reader results", reader.result)
        this.setState({ UploadedFile: (e.target.result) }, () => {
          console.log("UploadedFile", this.state.UploadedFile);
        });
      };
      reader.readAsText(file);
  }

  // this function handles the functionality of the upload button itself so the user can choose a file to upload
  onClickUpload = () => {
  document.getElementById('uploadFileButton').click();
  document.getElementById('uploadFileButton').onchange = () =>{      
  this.setState({
    FileUploadState:document.getElementById('uploadFileButton').value
        });
    }
  }

  // function that handles creating the edit view and list view components, with the json info that needs to be displayed
  displayEditView() { 
    let headerList = groupBy(this.state.Class_Desc, x => x.Fullfills);

    return (
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
            <td colSpan="3" className="alert-td">* Course prerequisites change regularly. Students are responsible for consulting advisors and the class schedule in the student portal for prerequisite information. *</td>
          </tr>

          <tr>
            <td className="heading-courses-td">Required CU Denver Core Curriculum Coursework</td>
            <td className="heading-credits-td">24</td>
            <td><a href="https://catalog.ucdenver.edu/cu-denver/undergraduate/graduation-undergraduate-core-requirements/cu-denver-core-curriculum/">See CU Denver Core Curriculum here</a></td>
          </tr>
          
          { // convert list of headers and courses to appropriate table rows
            Object.entries(headerList).map(([header, courses]) => (
            <React.Fragment key={'section'+header}>
              <tr>
                <td className="heading-courses-td">{header}</td>
                {/* get needed credits for section by looking in object */}
                <td className="heading-credits-td">{this.state.Needed[header]}</td>
                <td className="heading-notes-td"></td>
              </tr>
              { /* pass all properties of a course to the list view item to get the html code */
                courses.map((course) => (<ListViewItem 
                  key={'course'+course.Id}
                  {...course} // pass elements of a course as properties to the ListViewItem
                  // () => is a way to bind functions when needing to pass functions to another component
                  changeFunc={() => this.checkboxClick(course.Id)} // pass function to component: https://reactjs.org/docs/faq-functions.html
                  checked={this.state.Taken_Classes.indexOf(course.Id) > -1} // variable used to keep boxes checked when switch between views
                ></ListViewItem>))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  }

  getClass(id) {
    //checks every class description and finds the description that matches the class
    //for (let _#1_ in _#2_) will only give you the index where the element is stored #2
    for (let desc in this.state.Class_Desc) {
      if (this.state.Class_Desc[desc].Id === id) {
        return(this.state.Class_Desc[desc]);
      }
    }
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
      <Col key={'colyear' + year} className='yearcol'>
        <Container>
          <Row><Col className='year-header'>Year {year}</Col></Row>
          <Row className='sem-classes'>{
            // sort the semesters alphabetically, so that Fall always comes before Spring
            // uses map to loop and extract semester string in 'sem' and list of classes in 'classes'
            sems.sort((a, b) => a[0].localeCompare(b[0])).map(([sem, classes]) => (
            <Col key={sem} className='semcol'> 
              {/* Col: column tag, imported from bootstrap-react 
                  key attribute is used as a unique identifier for an item in a list in react */}
              <div className='sem-header'>{sem.split('-')[0]}</div>
              {classes.sort((a, b) => 
                // sort by color order 
                this.state.Color_Order.indexOf(a.Color) - this.state.Color_Order.indexOf(b.Color)
              ).map((cl, i) => (
                // FlowchartItem tag will contain the information about the class (what class you are taking that semester will be displayed)
                <FlowChartItem 
                  key={sem + 'class' + i}
                  {...cl} 
                  cl={this.getClass(cl.Name)}
                  taken={this.state.Taken_Classes.indexOf(cl.Name) > -1 /* use indexOf to get the index of the element in the list, if not in the list it returns -1*/}
                ></FlowChartItem>))}
            </Col>))
          }</Row>
        </Container>
      </Col>));
    // the display flowchart function will return the html for entire flowchart
    // since the html code is stored in a variable, the curly brackets are used to denote that the html code in the object should be inserted at this spot    
    return (
      <Container fluid id='flowchart'>
        <Row>
          {content}
        </Row>
      </Container>
    );
  }

  print() {
    window.print();
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

    // const [name, setName] = useState("");
    // const [selectedFile, setSelectedFile] = useState(null);

    // const hiddenFileInput = React.useRef(null);

    // const handleClick = event => {
      // hiddenFileInput.current.click();
    // };

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
            >Edit Mode</Nav.Link>
          </Nav>
        </Navbar>
        {content}
        <Navbar variant='dark' bg='dark' fixed='bottom'>
          <div>
          <input id="uploadFileButton" type="file" hidden onChange={(e)=>this.onChange(e)} />
          <Button variant="outline-primary" id="upload-button" onClick={this.onClickUpload}>Upload</Button>
          {this.state.FileUploadState}
          </div>
          <Button variant="outline-primary" id="save-button">Save</Button>
        </Navbar>
      </div>
    );
  }
}

export default App;
