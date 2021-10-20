import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Classes: [],
      Class_Desc: []
    };
  }

  // load data from json, when done call to initialize cards
  componentDidMount() {
    fetch('csreqs.json')
      .then(response => response.text())
      .then(json => JSON.parse(json))
      .then(data => this.setState(data))
      .catch(e => console.error('Couldn\'t read json file. The error was:\n', e));
  }

  render() {
    console.log("Rendering:\nHave state information of:");
    console.log(this.state);
    return (
      <div className="App">
        <h1>Go to 'App.js' and put code here to make the app.</h1>
        <p>Check the console if you wanna see what information is loading 
          from the json file.</p>
      </div>
    );
  }
}

export default App;
