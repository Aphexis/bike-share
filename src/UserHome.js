import React from 'react';
import './App.css';
import logo from './assets/bike-logo.png';
import {Button} from 'react-bootstrap';
import {Map, GoogleApiWrapper, Marker, Polygon} from 'google-maps-react';
import {Component} from 'react';
import logoMarker from './assets/bike-marker.png';
import html from 'react-inner-html';
import Radar from "radar-sdk-js";

var latitude = 1;
var longitude = 5;
var userLocation;
var bike_id = "5198900662";
var userId = "rgillan";
var canIunlock = false;

  // var bike_id; // get from database

function getLocation(cb) {
  const mapLink = document.querySelector("#map-link");
  return Radar.trackOnce(function(status, location, user, events) {
    console.log(status);
    console.log(location);
    console.log(location.latitude);
    // userLocation = location;
    // latitude = location.latitude;
    // longitude = location.longitude;
    // mapLink.textContent = location; - display - add marker
    console.log({lat: location.latitude, lng: location.longitude});
    cb(location);
    //return new Promise {lat: location.latitude, lng: location.longitude});
    // mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  });
}

const createGeofence = async (long, lat) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append(
    "Authorization",
    "prj_live_sk_d56b166e6c662999e3bd92574257b4d79cf30cb7"
  );

  var urlencoded = new URLSearchParams();
  urlencoded.append("description", "test");
  urlencoded.append("type", "circle");
  urlencoded.append("coordinates[0]", long);
  urlencoded.append("coordinates[1]", lat);
  urlencoded.append("radius", "50");
  urlencoded.append("tag", "bike");
  urlencoded.append("externalId", bike_id);

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

    console.log(result);
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
    console.log(events_request);
    // console.log(userId)
    let inFence = false;
    console.log("before for")
    for (var i = 0; i < obj.length; i++) {
      if ((obj[i].user.userId == userId) && (obj[i].geofence.externalId == bike_id)) {
        if (obj[i].type == "user.entered_geofence") {
          console.log("true");
          inFence = true;
        } else {
          break;
        }
      }
    }
      if (inFence) {
        // mapLink.textContent = `You unlocked the bike!`;
        alert("You've unlocked the bike!");
        canIunlock = true;
      } else {
        //mapLink.textContent = `You cannot unlock the bike!`;
        alert("You cannot unlock the bike!");
        canIunlock = false;
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

async function geofenceParser() {
    let geofence = await getBike(bike_id);
    const obj = JSON.parse(geofence);
    let coords = obj.geofence.geometry.coordinates;
    coords = coords[0];
    console.log(coords);
    let formatted_coords = [];
    for (let i = 0; i < coords.length; i++) {
      formatted_coords.push({lat: coords[i][1], lng: coords[i][0]});
    }
    return formatted_coords;
  }

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {

  state = {
    isLocked: true,
    loading: false,
    latitude: undefined,
    longitude: undefined,
  }

  componentDidMount() {
    Radar.setUserId(userId);
    this.getLocation();
  }

  getLocation = () => {
    this.setState({ loading: true });
    Radar.trackOnce((status, location = {}) => {
      console.log(status, location);
      if (status === Radar.STATUS.SUCCESS) {
        this.setState({
          loading: false,
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }
    })
  }

 displayArea = () => {
   // this has to loop and close on itself and change this funtion to take in the list
   const triangleCoords = [
     [{lat: 25.774, lng: -80.190},
     {lat: 18.466, lng: -66.118},
     {lat: 32.321, lng: -64.757},
     {lat: 25.774, lng: -80.190}]
   ];

   for (var i = 0; i < triangleCoords.length; i++) {
     return <Polygon
       paths={triangleCoords}
       strokeColor="#FFFFFF"
       strokeOpacity={0.8}
       strokeWeight={2}
       fillColor="#FFFFFF"
       fillOpacity={0.75} />
   }
 }

 renderMarker = () => {
   if (this.state.latitude) {
     return (
       <Marker position={{
         lat: this.state.latitude,
         lng: this.state.longitude
       }} />
     );
   }
   return null;
 }

 renderFence = (coords) => {
   console.log("AM I HERE");
   return (
     <Polygon
       paths={geofenceParser(coords)}
       strokeColor="#FFFFFF"
       strokeOpacity={0.8}
       strokeWeight={2}
       fillColor="#FFFFFF"
       fillOpacity={0.75} />
   );
 }

 onAction = (contents) => {

   if (this.state.isLocked) {
     canUnlock();
     this.getLocation();
     // createGeofence(this.state.longitude, this.state.latitude);
     var bike = getBike(bike_id); // process this boy
     console.log("Chocolateu: " + bike);
     //if (canIunlock) {
       this.setState({
         isLocked: !this.state.isLocked,
       });
       canIunlock = false;
    // }
   } else {
     this.setState({
       isLocked: !this.state.isLocked,
     });
     canIunlock = false;
   }
 }

  render() {
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 47.444, lng: -122.176}}
        >
          {this.renderMarker()}
          {this.renderFence(geofenceParser())}
        </Map>
        <div className="lock-btn-cont">
          <Button id="lock-btn" variant="success" onClick={this.onAction}>
            { this.state.isLocked ? 'Unlock' : 'Lock' }
          </Button>
        </div>
      </div>
    );
  }

}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAjuuYihkBjfoZKhjfK9Rwavf5mhrIlULc'
})(MapContainer);
