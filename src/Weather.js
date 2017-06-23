import React, { Component } from 'react';
import PlaceHolder from './PlaceHolder'
import axios from 'axios';
import Chart from 'chart.js';
import './App.css';

const APIKEY = `518b0cf8d7437984d1d1a7c3d70ef6a1`;
const GOOGLEAPIKEY = `AIzaSyCQTKjg8m35TRoZyL8EEspFIE_LjDFTmRs`;
const places = require('places.js');


class Weather extends Component {
  constructor(props){
    super(props);
    this.state = {
      lat: null,
      lng: null,
      clouds: [],
      humidity: [],
      temperature: [],
      wind: [],
      tempMax: [],
      tempMin: [],
      chart: null
    }
  }

  getCurrentLocation(){
    let address = document.querySelector('#address-value');
    let that = this;

    function success(pos) {
      const {latitude, longitude} = pos.coords;

      that.setState({
        lat: latitude,
        lng: longitude
      });

      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLEAPIKEY}`)
      .then(res => {
        address.textContent = res.data.results[1].formatted_address;
      });

      that.weather();
    };

    navigator.geolocation.getCurrentPosition(success);
  }

  componentDidMount(){

    const placesAutocomplete = places({ container: document.querySelector('#address-input') });
    let address = document.querySelector('#address-value');

    this.getCurrentLocation();

    placesAutocomplete.on('change', e => {

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
    const { lat, lng, clouds, humidity, temperature, wind, tempMax, tempMin } = this.state;
    const url = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather`;
    let that = this;
    let barChart;
    let donutChart;
    let scatterChart;

    axios.get(`${url}?lat=${lat}&lon=${lng}&APPID=${APIKEY}&units=imperial`)
         .then((res) => {
          // console.log(JSON.stringify(res.data, null, 2))
          const { clouds, main, wind } = res.data;

          that.setState({
            clouds: [clouds.all],
            humidity: [main.humidity],
            temperature: [main.temp],
            wind: [wind.speed],
            tempMax: [main.temp_max],
            tempMin: [main.temp_min]
          });

          const ctx = document.getElementById('barChart').getContext('2d');

          barChart = new Chart(ctx, {
              type: 'horizontalBar',
              borderSkipped: 'top',
              data: {
                labels: [''],
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
          const labels = [
            'Cloudiness (%)',
            'Humidity (%)',
            'Temperature (F)',
            'Min Temperature (F)',
            'Max Temperature (F)',
            'Wind Speed (MPH)'
          ];

          donutChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
              datasets: [{
                data: donutData,
                backgroundColor: ['#EBE0FF', '#D7ECFB', '#DBF2F2', '#FFF5DD', '#FFECD9', '#FFE0E6'],
                borderColor: ['#9966FF', '#36A2EB', '#4BC0C0', '#FFCD56', '#FF9F40', '#FF6384']
              }],
            labels: labels
            }
          });

          const ctx3 = document.getElementById('scatterChart').getContext('2d');

          scatterChart = new Chart(ctx3, {
              type: 'bubble',
              data: {
                datasets: [
                  {
                    label: 'Cloudiness (%)',
                    data: [{
                        x: 16,
                        y: that.state.clouds[0],
                        r: 12
                    }],
                    backgroundColor: '#EBE0FF',
                    borderColor: '#9966FF'
                  }, 
                  {
                    label: 'Humidity (%)',
                    data: [{
                      x: 15,
                      y: humidity[0],
                      r: 23  
                    }],
                    backgroundColor: '#D7ECFB',
                    borderColor: '#36A2EB'
                  }, 
                  {
                    label: 'Temperature (F)',
                    data: [{
                      x: 17,
                      y: temperature[0],
                      r: 30
                    }],
                    backgroundColor: '#DBF2F2',
                    borderColor: '#4BC0C0'
                  }, 
                  {
                    label: 'Min Temperature (F)',
                    data: [{
                      x: 20,
                      y: tempMin[0],
                      r: 16
                    }],
                    backgroundColor: '#FFF5DD',
                    borderColor: '#FFCD56'
                  }, 
                  {
                    label: 'Max Temperature (F)',
                    data: [{
                      x: 21,
                      y: tempMax[0],
                      r: 26
                    }],
                    backgroundColor: '#FFECD9',
                    borderColor: '#FF9F40'
                  }, 
                  {
                    label: 'Wind Speed (MPH)',
                    data: [{
                      x: 23,
                      y: w[0],
                      r: 18
                    }],
                    backgroundColor: '#FFE0E6',
                    borderColor: '#FF6384'
                  }
                ],
                labels: labels
              },
              options: {
                scales: {
                  xAxes: [{
                    display: false
                  }],
                  yAxes: [{
                    display : false
                  }]
                },
                layout: {
                  padding: {
                    left: 40,
                    right: 40,
                    bottom: 40,
                    top: 40
                  }
                }                
              }
          });

         }).catch(e => console.error());

    this.setState({ chart: true });
    console.log(this.state, 'state')
  }

  renderBarChart(){
    if (this.state.chart === null){
      return (
        <PlaceHolder/>
      )
    }
    return (
      <div className="jumbotron">
        <div className="jumbotron-white">
          <canvas id="barChart"></canvas>
        </div>          
      </div>
    )
  }  

  renderDonutChart(){
    if (this.state.chart === null){
      return (
        <PlaceHolder/>
      )
    }
    return (
      <div className="jumbotron">
        <div className="jumbotron-white">
          <canvas id="donutChart"></canvas>
        </div>          
      </div>
    )
  }

  renderScatterChart(){
    if (this.state.chart === null){
      return (
        <PlaceHolder/>
      )
    }
    return (
      <div className="jumbotron">
        <div className="jumbotron-white">
          <canvas id="scatterChart"></canvas>
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
              {this.renderScatterChart()}
            </div>
          </div>
        </div> 
      </div>
    );
  }
}

export default Weather;




