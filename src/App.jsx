import './App.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';


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
    return (<div>Some list view element</div>);
  }
}

class FlowChartItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //each element for the class description is separated into its own section for future modifications/styling 
    //!!this.props.cl && this.props.cl.(key) checks that if the element is not null then display this element property (conditional rendering)
    return (
      <div className={'flow-box ' + this.props.Color}>
        <div className='flow-id'>{this.props.Name}</div>
        <div className='flow-desc'>
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

  // function that handles creating the edit view and list view components, with the json info that needs to be displayed
  displayEditView() {
    return (<div>
      <ListViewItem></ListViewItem>
      <p>Put something here to render.</p>
    </div>);

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
    let semesters = []; // holds code for all of the semesters
    for (let sem in semClasses) {
      // Col: column tag, imported from bootstrap-react
      // key attribute is used as a unique identifier for an item in a list in react
      // FlowchartItem tag will contain the information about the class (what class you are taking that semester will be displayed)
      semesters.push(
        <Col key={sem} className={'flowcol ' + (sem.startsWith('Fall') ? 'fallcol' : 'springcol')}>
          <div className='sem-header'>{sem.split('-')[0]}</div>
          {semClasses[sem].sort((a, b) => b.Color.length - a.Color.length).map((cl, i) => (
            <FlowChartItem 
              key={sem + 'class' + i}
              {...cl} 
              cl={this.getClass(cl.Name)}
            ></FlowChartItem>))}
        </Col>
      );
    }
    // correctly sort semesters: sorted by years first, then by the semester
    semesters = semesters.sort((a, b) => {
      // get years and semesters of elements
      let [sema, yra] = a.key.split('-');
      let [semb, yrb] = b.key.split('-');
      // if years are same, check semesters
      if (yra == yrb) {
        if (sema == 'Spring') return 1;
        else return -1;
      }
      // otherwise, just sort by years
      return Number(yra) - Number(yrb);
    });
    // groups semesters by year, maps each entry to the html code for each year
    // makes new column for each year, new table inside for semester's columns
    let sem_years = Object.entries(groupBy(semesters, (x) => x.key.split('-')[1])).map(
      ([year, sem_classes]) => <Col key={'colyear' + year} className='yearcol'>
        <Container>
          <Row><Col className='year-header'>Year {year}</Col></Row>
          <Row className='sem-classes'>{sem_classes}</Row>
        </Container>
      </Col>);
    // the display flowchart function will return the html for entire flowchart
    // since the html code is stored in a variable, the curly brackets are used to denote that the html code in the object should be inserted at this spot    
    return (
      <Container fluid id='flowchart'>
        <Row>
          {sem_years}
        </Row>
      </Container>
    );
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
