import React, { Component } from 'react';
import './Icons.css';
import cloudy3 from './icons/cloudy-day-3.svg';
import rain1 from './icons/rainy-1.svg';
import thunder from './icons/thunder.svg';
import day from './icons/day.svg';
import night from './icons/night.svg';
import snowy6 from './icons/snowy-6.svg';

class Icons extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }
  render(){
    return (
      <div className="jumbotron jumbotron-icons">

      <img src={day} className="" alt="weather-icon" />
      <img src={cloudy3} className="" alt="weather-icon" />
      <img src={snowy6} className="" alt="weather-icon" />
      <img src={rain1} className="" alt="weather-icon" />
      <img src={thunder} className="" alt="weather-icon" />
      <img src={night} className="night" alt="night" />

      </div>
    )
  }
}

export default Icons;

