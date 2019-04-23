import React, { Component } from 'react';
import CardContainer from "./CardContainer";
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    items: []
    }
  componentDidMount() {
      // Call our fetch function below once the component mounts
      fetch('https://f336ab61.ngrok.io/')
      .then(response => response.json())
      .then(({values : items}) => this.setState({items}))
  }
  render() {
      return (
            <div className="App">
              <header className="App-header">
                <h1 className="App-title">Who is playing Ping Pong today ?</h1>
              </header>
              <div className = "wrapper">
              <CardContainer info={this.state.items}/>
              </div>
          </div>
          );
  }
}

export default App;
