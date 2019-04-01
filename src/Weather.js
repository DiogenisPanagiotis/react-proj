import React, { Component } from 'react';
import PlaceHolder from './PlaceHolder'
import Icons from './Icons'
import axios from 'axios';
import Chart from 'chart.js';
import './App.css';
import GoogleMapReact from 'google-map-react';

// const APIKEY = `518b0cf8d7437984d1d1a7c3d70ef6a1`;
const APIKEY = 'c008ca70462daa36b0137b9093fb6f93';
// const APIKEY = 'bdeaf5dd3f64536aa6910488547402a8';
// const GOOGLEAPIKEY = `AIzaSyCQTKjg8m35TRoZyL8EEspFIE_LjDFTmRs`;
const GOOGLEAPIKEY = `AIzaSyDpQJ0xfIXUkhpu3gN296XV5H-B9z47jYY`;
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
      chart: null,
      address: 'none'

    }
  }

  static defaultProps = {
    center: {lat: 59.95, lng: 30.33},
    zoom: 11
  };

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
        console.log("res: ", res)
        address.textContent = res.data.results[1].formatted_address;
        that.setState({ address: 'inherit'});
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

  }

  weather(){
    const { lat, lng } = this.state;
    const url = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather`;
    let that = this;
    let barChart;
    let donutChart;
    let scatterChart;
    let polarChart;

    axios.get(`${url}?lat=${lat}&lon=${lng}&appid=${APIKEY}&units=imperial`)
         .then((res) => {
          // console.log(JSON.stringify(res.data, null, 2))
          const { clouds, main, wind } = res.data;

          that.setState({
            clouds: [ parseInt(String(clouds.all).split('.')[0]) ],
            humidity: [ parseInt(String(main.humidity ).split('.')[0])],
            temperature: [ parseInt(String(main.temp).split('.')[0]) ],
            wind: [ parseInt(String(wind.speed).split('.')[0]) ],
            tempMax: [ parseInt(String(main.temp_max).split('.')[0]) ],
            tempMin: [ parseInt(String(main.temp_min).split('.')[0]) ]
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
                        bottom: 0,
                        top: 0
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
            labels: labels,
            },
            // options: {
            //   maintainAspectRatio: false,
            // }
          });

          const ctx4 = document.getElementById('polarChart').getContext('2d');

          polarChart = new Chart(ctx4, {
            type: 'polarArea',
            data: {
              datasets: [{
                data: donutData,
                backgroundColor: ['#EBE0FF', '#D7ECFB', '#DBF2F2', '#FFF5DD', '#FFECD9', '#FFE0E6'],
                borderColor: ['#9966FF', '#36A2EB', '#4BC0C0', '#FFCD56', '#FF9F40', '#FF6384']
              }],
            labels: labels,
            },
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

  renderDonutAndPolar(){
    if (this.state.chart === null){
      return (
        <div className="row">
          <div className="col-xs-12 col-md-10 col-md-offset-1">
            <PlaceHolder/>
          </div>
        </div>
      )
    }
    return (
      <div className="row">
        <div className="col-xs-12 col-md-10 col-md-offset-1">
          <div className="jumbotron">
            <div className="jumbotron-white">
              <canvas id="donutChart"></canvas>
            </div>          
          </div>
        </div>
        <div className="col-xs-12 col-md-10 col-md-offset-1">
          <div className="jumbotron">
            <div className="jumbotron-white">
              <canvas id="polarChart"></canvas>
            </div>          
          </div>
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

  renderMap(){
    const GoogleMapConfig = {
      key: GOOGLEAPIKEY
    };
    const mapContainer = {
      position: 'relative',
      height: 600
    }
    const marker = () => {
      return (
        <span
          className="glyphicon glyphicon-map-marker" 
          aria-hidden="true"
          lat={this.state.lat}
          lng={this.state.lng}
          style={{ fontSize: '3em', color: '#FF6384'}}
        >
        </span>
      )
    }
    const {lat, lng} = this.state;
    if (this.state.chart === null){
      return (
        <PlaceHolder/>
      )
    }
    return (
      <div className="jumbotron" style={mapContainer}>
        <GoogleMapReact
          center={{lat: lat, lng: lng}}
          defaultZoom={this.props.zoom}
          bootstrapURLKeys={GoogleMapConfig}
        >
        {marker()}
        </GoogleMapReact>
      </div>
    );
  }
  renderAddress(){
    const location = {
      display: this.state.address
    }
    return (
      <nav aria-label="..." style={location}>
        <ul className="pager">
          <li className="next"><a id="address-value"></a></li>
        </ul>
      </nav>
    );
  }

  renderIcons(){
    if (this.state.chart === null){
      return (
        <PlaceHolder/>
      )
    }
    return (
      <Icons/>
    )    
  }
  renderInput(){
    const input = () => {
      return (
        <div className="jumbotron jumbotron-search">
          <ul className="nav nav-tabs">
            <li role="presentation" className="active"><a href="#">Weather</a></li>
          </ul>
          <br></br>
          <input type="search" id="address-input" placeholder="Where are we going?" />
          <p></p>
          {this.renderAddress()}
        </div>   
      )
    }
    const input2 = () => {
      return (
        <div className="jumbotron jumbotron-search" style={{ display: 'none'}}>
          <ul className="nav nav-tabs">
            <li role="presentation" className="active"><a href="#">Weather</a></li>
          </ul>
          <br></br>
          <input type="search" id="address-input" placeholder="Where are we going?" />
          <p></p>
          {this.renderAddress()}
        </div>   
      )
    }
    if (this.state.chart === null){
      return (
        <div className="row">
          <div className="col-xs-12 col-md-6">
          {input2()}
          <PlaceHolder/>
          </div>
          <div className="col-xs-12 col-md-6">
            <PlaceHolder/>
          </div>
        </div>
      )
    } else {
      const {temperature, wind, humidity, clouds} = this.state;
      const tempStyle = {
        width: temperature[0] + '%',
        backgroundColor: '#4BC0C0',
        minWidth: '3em'
      }
      const windStyle = {
        width: wind[0] + '%',
        backgroundColor: '#FF6384',
        minWidth: '5em'
      }
      const humidityStyle = {
        width: humidity[0] + '%',
        backgroundColor: '#36A2EB',
        minWidth: '3em'
      }
      const cloudsStyle = {
        width: clouds[0] + '%',
        backgroundColor: '#9966FF',
        minWidth: '6em'
      }

      const renderProgress = () => {
        return (
          <div>
            <ul className="nav nav-pills">
              <li role="presentation" className="active"><a className="progress-t" href="#">Temperature</a></li>
              <li role="presentation" className="active"><a className="progress-w" href="#">Wind</a></li>
              <li role="presentation" className="active"><a className="progress-h" href="#">Humidity</a></li>
              <li role="presentation" className="active"><a className="progress-c" href="#">Clouds</a></li>
            </ul>
            <div className="progress">
              <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow={temperature[0]} aria-valuemin="0" aria-valuemax="100" style={tempStyle}>
              {temperature[0]}
              </div>
            </div>            
            <div className="progress">
              <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow={wind[0]} aria-valuemin="0" aria-valuemax="100" style={windStyle}>
              {wind[0]}
              </div>
            </div>
            <div className="progress">
              <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow={humidity[0]} aria-valuemin="0" aria-valuemax="100" style={humidityStyle}>
              {humidity[0]}
              </div>
            </div>
            <div className="progress progress-last">
              <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow={clouds[0]} aria-valuemin="0" aria-valuemax="100" style={cloudsStyle}>
              {clouds[0]}
              </div>
            </div>
          </div>
        )
      };

      return (
        <div className="row">
          <div className="col-xs-12 col-md-6">
          {input()}
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="jumbotron">
            {renderProgress()}
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 col-md-offset-1">
              {this.renderInput()}
              {this.renderIcons()}
              {this.renderMap()}
              {this.renderBarChart()}
              {/*this.renderScatterChart()*/}
            </div>
          </div>
              {this.renderDonutAndPolar()}
        </div> 
      </div>
    );
  }
}

export default Weather;




