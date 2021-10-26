import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

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
    return (<div>Some flow chart element</div>);
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
  componentDidMount() {
    fetch('csreqs.json')
      .then(response => response.text())
      .then(json => JSON.parse(json))
      .then(data => this.setState(data))
      .catch(e => console.error('Couldn\'t read json file. The error was:\n', e));
  }

  displayEditView() {
    return (<div>
      <ListViewItem></ListViewItem>
      <p>Put something here to render.</p>
      <Button>THIS IS A BUTTON</Button>
    </div>);

  }

  displayFlowChart() {
    let semesters = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        semesters.push(<Col><p>{j ? 'Spring' : 'Fall'} {i+1}</p><FlowChartItem></FlowChartItem></Col>);
      }
    }
    return (
      <Container>
        <Row>
          {semesters}
        </Row>
      </Container>
    );
  }

  render() {
    console.log("Rendering:");
    console.log("Have state information of:");
    console.log(this.state);

    let content;
    if (this.state.Display === 'Edit') {
      content = this.displayEditView();
    } else {
      content = this.displayFlowChart();
    }
    return (
      <div className="App">
        <Navbar variant='dark' bg='dark' sticky='top'>
          <Navbar.Brand>CUrPLAN</Navbar.Brand>
          <Nav>
            <Nav.Link className={(this.state.Display === 'Flow') ? 'active' : 'inactive'}>Flowchart</Nav.Link>
            <Nav.Link className={(this.state.Display === 'Edit') ? 'active' : 'inactive'}>Edit Mode</Nav.Link>
          </Nav>
        </Navbar>
        <h1>Go to 'App.js' and put code here to make the app.</h1>
        <p>Check the console if you wanna see what information is loading 
          from the json file.</p>
        {content}
      </div>
    );
  }
}

export default App;
