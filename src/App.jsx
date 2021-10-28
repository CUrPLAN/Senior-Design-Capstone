import './App.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

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
    return (
      <div className='flow-box'>
        {this.props.Name}
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

  // function that handles the content from the json file that should be displayed, and labels the semesters accordingly
  displayFlowChart() {
    // stores the classes, semester type, and year for each semester
    let semesters = [];
    // i = number of years to graduate in
    // j = number of semesters per year
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        // Col: column tag, imported from bootstrap-react
        // key attribute is used as a unique identifier for an item in a list in feact
        // p tag will display Spring if j = 2, otherwise Fall will be displayed; shorthanded if/else statement used
        // i+1 is displayed as the year because the loop starts at 0
        // FlowchartItem tag will contain the information about the class (what class you are taking that semester will be displayed)
        semesters.push(
          <Col key={'year' + i + 'sem' + j}>
            <p>{j ? 'Spring' : 'Fall'} {i+1}</p>
            <FlowChartItem {...this.state.Classes[0]}></FlowChartItem>
          </Col>
        );
      }
    }
    // the display flowchart function will return the html for entire flowchart
    // since the html code is stored in a variable, the curly brackets are used to denote that the html code in the object should be inserted at this spot
    return (
      <Container>
        <Row>
          {semesters}
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
        <h1>Go to 'App.js' and put code here to make the app.</h1>
        <p>Check the console if you wanna see what information is loading 
          from the json file.</p>
        {content}
        <Navbar variant='dark' bg='dark' fixed='bottom'>
          <Button variant="outline-primary" id="save-button">Save</Button>
        </Navbar>
      </div>
    );
  }
}

export default App;
