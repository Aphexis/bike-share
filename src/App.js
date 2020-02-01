import React from 'react';
import './App.css';
import logo from './assets/bike-logo.png';
//import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <body>
      <div className="App">
        <h1 id="logo-title">Bike Share</h1>
        <img id="logo" src={logo} alt={"logo"} />
      </div>
    </body>
  );
}

export default App;
