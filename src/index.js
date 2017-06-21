import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Nav from './Nav';
import Weather from './Weather';
import Contact from './Contact';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const Routes = () => (
	<div>
  	<Route exact path='/' component={App}/>
  	<Route path='/' component={Nav}/>
  	<Route exact path='/weather' component={Weather}/>
  	<Route exact path='/contact' component={Contact}/>
	</div>
)

ReactDOM.render(<Router><Routes/></Router>, document.getElementById('root'));
registerServiceWorker();
