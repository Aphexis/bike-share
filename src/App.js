import React from 'react';
import './App.css';
import logo from './assets/bike-logo.png';
import {Button} from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import MapContainer from './UserHome.js';

function App() {
  return (
    <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/userhome">
            <MapContainer />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>

    </Router>
  );
}

function Home() {
  return (
    <div className="default">
        <h1 id="logo-title">Bike Share</h1>
        <img id="logo" src={logo} alt={"logo"} />
        <div className="centered-btn">
        <Button id="my-btn" variant="success"><Link className="route-links" to="/login">Log In</Link></Button>
      </div>
    </div>
  );
}

function Login() {
  return (
    <div className="default">
      <h1 id="logo-title">Bike Share</h1>
      <img id="logo" src={logo} alt={"logo"} />
      <div className="input-g">
        <label for="username-input" className="login-field-label">Username</label>
        <input id="username-input" className="login-field" type="text" placeholder="Enter Username" />
      </div>
      <div className="input-g-outer">
        <div className="input-g">
          <label for="password-input" className="login-field-label">Password</label>
          <input id="password-input" className="login-field" type="password" placeholder="Enter Password" />
        </div>
        <div className="centered-btn">
          <Button id="my-btn" variant="success"><Link className="route-links" to="/userhome">Log In</Link></Button>
        </div>
      </div>
    </div>
  );
}


export default App;
