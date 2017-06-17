import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Nav from './Nav';
import About from './About';
import Contact from './Contact';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Routes = () => (
	<div>
  	<Route exact path='/' component={App}/>
  	<Route path='/' component={Nav}/>
  	<Route exact path='/about' component={About}/>
  	<Route exact path='/contact' component={Contact}/>
	</div>
)

ReactDOM.render(<Router><Routes/></Router>, document.getElementById('root'));
registerServiceWorker();
