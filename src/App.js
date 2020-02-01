import React from 'react';
import './App.css';
import logo from './assets/bike-logo.png';
import {Button} from 'react-bootstrap';

function App() {
  return (
    <div className="home">
        <h1 id="logo-title">Bike Share</h1>
        <img id="logo" src={logo} alt={"logo"} />
      <div className="centered-btn">
        <Button id="my-btn" variant="success">Log In</Button>
      </div>
    </div>

    <div className="login">

    </div>


  );
}

export default App;
