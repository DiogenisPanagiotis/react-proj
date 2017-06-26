import React, { Component } from 'react';
import './App.css';
import AnimatedNumber from 'react-animated-number';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      hours: null,
      minutes: null
    }
  }

  componentDidMount(){
    this.renderTime();
  }
  formatTime(n){
    if ( n < 10 ){
      const formatted = '0' + n;
      return formatted
    }
    return n;
  }
  renderTime(){
    let time = new Date().toLocaleTimeString();
    const AMPM = time.slice(-2);
    const hours = parseInt(time.split(':')[0]);
    const minutes = parseInt(time.split(':')[1]);
    this.setState({
      hours: parseInt(`${hours}`),
      minutes: parseInt(`${minutes}`),
      AMPM: AMPM
    });

  }

  render() {
    return (
      <div className="App">
        <div className="container">
        {/* jumbotron */}
          <div className="jumbotron">
            <h1>Home</h1>
            <AnimatedNumber 
              component="text" 
              value={this.state.hours}
              style={{
                transition: '0.1s ease-out',
                fontSize: 48,
                transitionProperty: 'background-color, color, opacity'
              }}
              frameStyle={perc => (
                perc === 100 ? {} : {}
              )}
              duration={2000}
              stepPrecision={0}
              formatValue={n => n}/>
            <div style={{fontSize: 48, display: "inline-block"}}>:</div>
            <AnimatedNumber 
              component="text" 
              value={this.state.minutes}
              style={{
                transition: '0.1s ease-out',
                fontSize: 48,
                transitionProperty: 'background-color, color, opacity'
              }}
              frameStyle={perc => (
                perc === 100 ? {} : {}
              )}
              duration={2000}
              stepPrecision={0}
              formatValue={n => this.formatTime(n)}/>                
            <div style={{fontSize: 24, display: "inline-block"}}>{this.state.AMPM}</div>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. </p>
            <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non dolore magnam aliquam quaerat voluptatem.</p>
            <p>
              <a className="btn btn-lg btn-primary" href="../../components/#navbar" role="button">Welcome</a>
            </p>
          </div>
        {/* jumbotron */}
        </div> 
      </div>
    );
  }
}

export default App;




