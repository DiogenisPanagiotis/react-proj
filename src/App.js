import React, { Component } from 'react';
import './App.css';
// import { Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
        {/* jumbotron */}
          <div className="jumbotron">
            <h1>Home</h1>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. </p>
            <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non dolore magnam aliquam quaerat voluptatem.</p>
            <p>
              <a className="btn btn-lg btn-primary" href="../../components/#navbar" role="button">View navbar docs &raquo;</a>
            </p>
          </div>
        {/* jumbotron */}
        </div> 
      </div>
    );
  }
}

export default App;




