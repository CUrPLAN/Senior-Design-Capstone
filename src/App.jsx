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
      <div></div>
      );
  }
}

class FlowChartItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //each element for the class description is separated into its own section for future modifications/styling 
    return (
      <div className={'flow-box ' + this.props.Color}>
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
      Display: 'Edit',
      Classes: [],
      Class_Desc: []
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

  // function to sum the credits for the category that is passed to it
  getSum(fulfills){
    //checks the 'fulfills' element of each course
    // and if there is a match, it will add to the total.

    for (let i in this.state.Needed) {
      if (i === fulfills) {
        return(this.state.Needed[fulfills])
        // console.log("total sum: ", total_sum)
      }
    }
  }
  // function that handles creating the edit view and list view components, with the json info that needs to be displayed
  displayEditView() { 

    let headerList = groupBy(this.state.Class_Desc, x => x.Fullfills);
    // let header_zero = Object.entries(headerList)[1]?Object.entries(headerList)[1]: " ";
    // let header_zero_zero = header_zero[0];
    // console.log("header_zero_zero: ", header_zero_zero);

    // let arr = new Array(20);
    // {Object.entries(headerList).map((headers) => (
    //     console.log("header: ", headers)
    // ))};

    // {this.state.Class_Desc.map((headerList)=> (
    //           <tr>
    //             <td></td>
    //           </tr>
    //         ))}
    // let header = new Array(headerList.length);
    // {for (let i = 0; i < headerList.length; i++){
    //         header.push(Object.entries(headerList)[i])
    // }}
    // console.log("header", header)

    // let header = new Array(headerList.length);
    // headerList.forEach(function(element){
    //         header.push(element)
    // })
    
    // console.log("type of headerList", typeof(header))

    // let a = new Array(4)
    // for (let i = 0; i < 4; i++) {
    //   a[i] = new Array(4)
    //   for (let j = 0; j < 4; j++) {
    //     a[i][j] = '[' + i + ', ' + j + ']'
    //   }
    // }
    // console.log("a", a)

    // let headers = new Array(20);
    // {this.state.Class_Desc.map((classes)=> (
    //         headers.push(classes.Fulfills?classes.Fulfills: " ")
    //         ))}

    //console.log("headers", headers)

    // <tr>
    //           <td className="heading-courses-td">Required Engineering Design Courses</td>
    //           <td className="heading-credits-td">{this.getSum("Required Engineering Design Courses")}</td>
    //           <td className="heading-notes-td"></td>
    //         </tr>
    //         <tr>
    //           <td className='courses'>{this.state.Class_Desc[0]?this.state.Class_Desc[0].Id: " "} {this.state.Class_Desc[0]?this.state.Class_Desc[0].Name: " "}</td>
    //           <td className='credits'>{this.state.Class_Desc[0]?this.state.Class_Desc[0].Credits: " "}</td>
    //           <td className='notes'>{this.state.Class_Desc[0]?this.state.Class_Desc[0].Notes: " "}</td>
    //         </tr>

    // <tr>
    //           <td className="heading-courses-td">Required Computer Science Core Courses</td>
    //           <td className="heading-credits-td">{this.getSum("Required Computer Science Core Courses")}</td>
    //           <td></td>
    //         </tr>
            
    //         {this.state.Class_Desc.map((classes)=> (
    //         <tr>
    //           <td className = 'courses'>{classes.Id?classes.Id: " "} {classes.Name?classes.Name: " "}</td>
    //           <td className= 'credits'>{classes.Credits?classes.Credits: " "}</td>
    //           <td className= 'notes'>{classes.Notes?classes.Notes: " "}</td>
    //         </tr>
    //         ))}
    console.log(headerList);

    return (
      <div>
      <ListViewItem></ListViewItem>
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
              <td  className="heading-credits-td">24</td>
              <td><a href="https://catalog.ucdenver.edu/cu-denver/undergraduate/graduation-undergraduate-core-requirements/cu-denver-core-curriculum/">See CU Denver Core Curriculum here</a></td>
            </tr>
            
            {Object.entries(headerList).map((headers) => (
              <React.Fragment>
              <tr>
                <td className="heading-courses-td">{headers[0]}</td>
                <td className="heading-credits-td">{this.getSum(headers[0])}</td>
                <td className="heading-notes-td"></td>
              </tr>
            
              {Object.entries(headers[1]).map((courses, index) => (
                <tr>
                  
                  <td className="courses">
                  <InputGroup className='class-checkbox'>
                    <InputGroup.Checkbox aria-label="Checkbox for class"/>
                  </InputGroup>{courses[1].Id?courses[1].Id: " "} {courses[1].Name?courses[1].Name: " "}</td>
                  <td className="credits">{courses[1].Credits?courses[1].Credits: " "}</td>
                  <td className="notes">{courses[1].Notes?courses[1].Notes: " "}</td>
                  {console.log("index: ", index)}
                </tr>)
              )}

              </React.Fragment>
              ))}

          </tbody>
        </table>
      </div>
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
    console.log("List: ", Object.entries(semClasses));
    // get classes grouped by semester to be grouped by year
    let yearSems = groupBy(Object.entries(semClasses), x => x[0].split('-')[1]);
    console.log("List2: ", Object.entries(yearSems));
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
            <Col key={sem}> 
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
    console.log("Rendering:");
    console.log("Have state information of:");
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
            >Edit Mode</Nav.Link>
          </Nav>
        </Navbar>
        {content}
        <Navbar variant='dark' bg='dark' fixed='bottom'>
          <Button variant="outline-primary" id="upload-button">Upload</Button>
          <Button variant="outline-primary" id="save-button">Save</Button>
        </Navbar>
      </div>
    );
  }
}

export default App;
