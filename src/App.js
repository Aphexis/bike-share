import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Radar from 'radar-sdk-js';
import {useEffect} from 'react';

function App() {
  var latitude = 100;
  var longitude = 50;
  var userLocation;

  useEffect(() => {
    Radar.initialize("prj_live_pk_47e77da5365a55ff13b52e251c00b8e310e79770");
    Radar.setUserId("ElleHacks");
  });

  function getLocation() {
    const mapLink = document.querySelector("#map-link");
    Radar.trackOnce(function(status, location, user, events){
      console.log(status);
      console.log(location);
      userLocation = location;
      latitude = location.latitude;
      longitude = location.longitude;
      // mapLink.textContent = location;
      mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    })
  }

  function geoFindMe() {
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");

    mapLink.href = "";
    mapLink.textContent = "";

    function success(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      status.textContent = "";
      mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${this.longitude}`;
      mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    }

    function error() {
      status.textContent = "Unable to retrieve your location";
    }

    if (!navigator.geolocation) {
      status.textContent = "Geolocation is not supported by your browser";
    } else {
      status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  return (
    <div className="App">
      <button id="find-me" onClick={getLocation}>
        Show my location
      </button>
      {/* <button id="make-geofence" onClick={makeGeofence}>
        Make a geofence
      </button>
      <button id="user" onClick={getUser}>
        Get a user
      </button> */}
      <br />
      <p id="status"></p>
      <a id="map-link" target="_blank"></a>
    </div>
  );
}

// document.querySelector('#find-me').addEventListener('click', geoFindMe);

export default App;
