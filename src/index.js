import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Nav from './Nav';
import Weather from './Weather';
import Contact from './Contact';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {InstantSearch} from 'react-instantsearch/dom';


const Routes = () => (
	<div>
	  <InstantSearch
    appId="latency"
    apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
    indexName="bestbuy"
  >
    {/* Search widgets will go there */}
  	<Route exact path='/' component={App}/>
  	<Route path='/' component={Nav}/>
  	<Route exact path='/weather' component={Weather}/>
  	<Route exact path='/contact' component={Contact}/>
  </InstantSearch>
	</div>
)

ReactDOM.render(<Router><Routes/></Router>, document.getElementById('root'));
registerServiceWorker();
