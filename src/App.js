import React from "react";
import "./App.css";
import Radar from "radar-sdk-js";
import { useEffect, useState, NewComponent } from "react";

function App() {
  var latitude = 100;
  var longitude = 50;
  var userLocation;
  var bikeGeofence;
  var bike_id = "test";
  var userEvents;
  var userId = "ElleHacks";
  
  // var bike_id; // get from database

  function getLocation() {
    const mapLink = document.querySelector("#map-link");
    Radar.trackOnce(function(status, location, user, events) {
      console.log(status);
      console.log(location);
      userLocation = location;
      latitude = location.latitude;
      longitude = location.longitude;
      // mapLink.textContent = location;
      mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    });
  }

  const createGeofence = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append(
      "Authorization",
      "prj_live_sk_d56b166e6c662999e3bd92574257b4d79cf30cb7"
    );

    var urlencoded = new URLSearchParams();
    urlencoded.append("description", "test");
    urlencoded.append("type", "circle");
    urlencoded.append("coordinates[0]", "55");
    urlencoded.append("coordinates[1]", "10");
    urlencoded.append("radius", "50");
    urlencoded.append("tag", "bike");
    urlencoded.append("externalId", "testing");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };

    fetch("https://api.radar.io/v1/geofences", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log("error", error));
  };

  async function getBike(bike_id) { //get bike geofence
    console.log("making a request");
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "prj_live_sk_d56b166e6c662999e3bd92574257b4d79cf30cb7"
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    let result = await fetch("https://api.radar.io/v1/geofences/bike/".concat(bike_id), requestOptions)
      // .then(response => response.text())
      // .then(result => (bikeGeofence = result))
      // .catch(error => console.log("error", error));
    return result.text();
  }

  async function getEvents() {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "prj_live_sk_d56b166e6c662999e3bd92574257b4d79cf30cb7"
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    let result = await fetch("https://api.radar.io/v1/events", requestOptions)
      // .then(response => response.text())
      // .then(result => console.log(result))
      // .catch(error => console.log("error", error));
    return result.text();
  }

  async function canUnlock() {
    const mapLink = document.querySelector("#map-link");
    // bikeGeofence = await getBike(bike_id);
    // console.log(bikeGeofence);
    // check if user is in the geofence
    // if most recent event is entered geofence where geofence id = bike id, then can unlock
    // otherwise, can't unlock
    let events_request = await getEvents();
    const obj = JSON.parse(events_request).events;
    // console.log(userId)
    let inFence = false;
    console.log("before for")
    for (var i = 0; i < obj.length; i++) {
      if ((obj[i].user.userId == userId) && (obj[i].geofence.description == bike_id)) {
        if (obj[i].type == "user.entered_geofence") {
          console.log("true");
          inFence = true;
        } else {
          break;        
        }
      }
    }
      if (inFence) {
        mapLink.textContent = `You unlocked the bike!`;
      } else {
        mapLink.textContent = `You cannot unlock the bike!`;
      }
    // obj.forEach(item => {
    //   // console.log(item)
    //   if ((item.user.userId == userId) && (item.geofence.description == bike_id)) {
    //     if (item.type == "user.entered_geofence") {
    //       console.log("true");
    //       inFence = true;
    //   } else {
    //     break;        
    //   }
    // });
    // if (inFence) {
    //   mapLink.textContent = `You unlocked the bike!`;
    // } else {
    //   mapLink.textContent = `You cannot unlock the bike!`;
    // }
 
    // look for most recent event with .user.userId == userId 
    //   and geofence.description == bike_id
    // if .type == user.entered_geofence -> return true
    // else -> return false
  }

  return (
    <div className="App">
      <button id="find-me" onClick={getLocation}>
        Show my location
      </button>
      <button id="make-geofence" onClick={createGeofence}>
        Make a geofence
      </button>
      <button id="unlock" onClick={canUnlock}>
        Unlock bike
      </button>
      <br />
      <p id="status"></p>
      <a id="map-link" target="_blank"></a>
    </div>
  );
}

// document.querySelector('#find-me').addEventListener('click', geoFindMe);

export default App;
