import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Chart from 'chart.js';

const APIKEY = `518b0cf8d7437984d1d1a7c3d70ef6a1`;
const places = require('places.js');

class Weather extends Component {
  constructor(props){
    super(props);
    this.state = {
      lat: null,
      lng: null,
      clouds: [],
      humidity: [],
      location: [],
      temperature: [],
      wind: [],
      tempMax: [],
      tempMin: [],
      chart: null,
      requested: null
    }
  }

  componentDidMount(){

    let placesAutocomplete = places({ container: document.querySelector('#address-input') });

    const address = document.querySelector('#address-value');
    placesAutocomplete.on('change', e => {
      // console.log(e.suggestion);
      this.setState({
        lat: e.suggestion.latlng.lat,
        lng: e.suggestion.latlng.lng
      });
      this.weather();
      address.textContent = e.suggestion.value 
    });

    placesAutocomplete.on('clear', () => {
      address.textContent = '';
    });
  }

  weather(){
    const { lat, lng, clouds, humidity, location, temperature, wind, tempMax, tempMin } = this.state;
    const url = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather`;
    let that = this;
    let barChart;
    let donutChart;

    clouds.shift();
    humidity.shift();
    location.shift();
    temperature.shift();
    wind.shift();
    tempMax.shift();
    tempMin.shift();

    axios.get(`${url}?lat=${lat}&lon=${lng}&APPID=${APIKEY}&units=imperial`)
         .then((res) => {
          // console.log(JSON.stringify(res.data, null, 2))
          const { clouds, main, name, wind } = res.data;
          that.setState({
            requested: res.data,
            clouds: [clouds.all],
            humidity: [main.humidity],
            location: [name],
            temperature: [main.temp],
            wind: [wind.speed],
            tempMax: [main.temp_max],
            tempMin: [main.temp_min]
          });
         
          const ctx = document.getElementById('myChart').getContext('2d');

          barChart = new Chart(ctx, {
              type: 'horizontalBar',
              borderSkipped: 'top',
              data: {
                labels: that.state.location,

                datasets: [{
                    label: 'Cloudiness (%)',
                    data: that.state.clouds,
                    backgroundColor: '#EBE0FF',
                    borderColor: '#9966FF',
                    borderWidth: 1            
                  }, {
                    label: 'Humidity (%)',
                    data: that.state.humidity,
                    backgroundColor: '#D7ECFB',
                    borderColor: '#36A2EB',
                    borderWidth: 1
                  }, {
                    label: 'Temperature (F)',
                    data: that.state.temperature,
                    backgroundColor: '#DBF2F2',
                    borderColor: '#4BC0C0',
                    borderWidth: 1
                  }, {
                    label: 'Min Temperature (F)',
                    data: that.state.tempMin,
                    backgroundColor: '#FFF5DD',
                    borderColor: '#FFCD56',
                    borderWidth: 1
                  }, {
                    label: 'Max Temperature (F)',
                    data: that.state.tempMax,
                    backgroundColor: '#FFECD9',
                    borderColor: '#FF9F40',
                    borderWidth: 1
                  }, {
                    label: 'Wind Speed (MPH)',
                    data: that.state.wind,
                    backgroundColor: '#FFE0E6',
                    borderColor: '#FF6384',
                    borderWidth: 1
                  }]
              },
              options: {
                    title: {
                      display: true,
                      text: 'Weather',
                      fontSize: 20
                    },
                    layout: {
                      padding: {
                        left: 0,
                        right: 0,
                        bottom: 20,
                        top: 20
                      }
                    },
                    scales: {
                      xAxes: [{
                        display: false
                      }],
                      yAxes: [{
                        gridLines : {
                          display : false
                        }
                      }]
                    }
                  }
          });

          const {humidity, temperature, tempMax, tempMin, wind: w } = that.state;
          const ctx2 = document.getElementById('donutChart').getContext('2d');
          const donutData = that.state.clouds.concat(humidity, temperature, tempMax, tempMin, w);

          donutChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
              datasets: [{
                data: donutData,
                backgroundColor: ['#EBE0FF', '#D7ECFB', '#DBF2F2', '#FFF5DD', '#FFECD9', '#FFE0E6'],
                borderColor: ['#9966FF', '#36A2EB', '#4BC0C0', '#FFCD56', '#FF9F40', '#FF6384']
              }],
            labels: [
              'Cloudiness (%)',
              'Humidity (%)',
              'Temperature (F)',
              'Min Temperature (F)',
              'Max Temperature (F)',
              'Wind Speed (MPH)'
              ]
            }
          });

         }).catch(e => console.error());

    this.setState({
      chart: barChart
    });
    console.log(this.state, 'state')
  }

  renderBarChart(){
    if (this.state.chart === null){
      return ''
    }
    return (
      <div className="jumbotron">
        <div className="jumbotron-white">
          <canvas id="myChart"></canvas>
        </div>          
      </div>
    )
  }  

  renderDonutChart(){
    if (this.state.chart === null){
      return ''
    }
    return (
      <div className="jumbotron">
        <div className="jumbotron-white">
          <canvas id="donutChart"></canvas>
        </div>          
      </div>
    )
  }

  renderInput(){
    return (
      <div className="jumbotron jumbotron-search">
        <h2>Weather</h2>
        <input type="search" id="address-input" placeholder="Where are we going?" />
        <p></p>
        <p><strong id="address-value"></strong></p>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-8 col-md-offset-2">
              {this.renderInput()}
              {this.renderBarChart()}
              {this.renderDonutChart()}
            </div>
          </div>
        </div> 
      </div>
    );
  }
}

export default Weather;




