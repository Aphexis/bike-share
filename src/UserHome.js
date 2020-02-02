import React from 'react';
import './App.css';
import logo from './assets/bike-logo.png';
import {Button} from 'react-bootstrap';
import {Map, GoogleApiWrapper, Marker, Polygon} from 'google-maps-react';
import {Component} from 'react';
import logoMarker from './assets/bike.png';
import html from 'react-inner-html';
import Radar from "radar-sdk-js";

// var latitude = 1;
// var longitude = 5;
// var userLocation;
var bike_id = "5198900662";
var userId = "rgillan";

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

const doRadar = (url, props) => {
  return fetch('https://api.radar.io/v1' + url, {
    headers: {
      'Authorization': 'prj_live_sk_d56b166e6c662999e3bd92574257b4d79cf30cb7',
    },
    redirect: 'follow',
    ...props,
  });
}

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

    // console.log(result);
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
    // console.log(events_request);
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
        // alert("You've unlocked the bike!");
        return true;
      } else {
        //mapLink.textContent = `You cannot unlock the bike!`;
        // alert("You cannot unlock the bike!");
        return false;
      }
}

async function geofenceParser() {
    let geofence = await getBike(bike_id);
    const obj = JSON.parse(geofence);
    let coords = obj.geofence.geometry.coordinates;
    coords = coords[0];
    let formatted_coords = [];
    for (let i = 0; i < coords.length; i++) {
      formatted_coords.push({lat: coords[i][1], lng: coords[i][0]});
    }
    console.log(formatted_coords);
    return await formatted_coords;
  }

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {

  state = {
    isLocked: true,
    loading: true,
    marker: {
      lat: undefined,
      lng: undefined,
    },
    points: [],
  }

  componentDidMount() {
    Radar.initialize("prj_live_pk_47e77da5365a55ff13b52e251c00b8e310e79770");
    Radar.setUserId(userId);
    Promise.all([
      this.getLocation(),
      this.getPoints(),
    ]).then(() => {
      this.setState({ loading: false });
      // this.timer = window.setInterval(() => {
      //   this.getLocation();
      // }, 10000);
    });
    let result = fetch("http://40b9210c.ngrok.io/lock");
  }

  componentWillUnmount() {
    // window.clearInterval(this.timer);
  }

  getLocation = () => {
    return new Promise(resolve => {
      Radar.trackOnce((status, location = {}) => {
        console.log(status, location);
        if (status === Radar.STATUS.SUCCESS) {
          this.setState({
            marker: {
              lat: location.latitude,
              lng: location.longitude,
            }
          });
          resolve();
        }
      });
    });
  }

  getPoints = async () => {
    const data = await doRadar('/geofences/bike/' + bike_id);
    const json = await data.json();
    this.setState({
      points: json.geofence.geometry.coordinates[0]
      .map(([ lng, lat ]) => ({ lat, lng })),
    });
  }

 renderMarker = () => {
   return (
     <Marker icon={logoMarker} position={this.state.marker} />
   );
 }

 renderFence = () => {
   return (
     <Polygon
       paths={this.state.points}
       strokeColor="#14C865"
       strokeOpacity={0.8}
       strokeWeight={2}
       fillColor="#14C865"
       fillOpacity={0.75}
     />
   );
 }

 onAction = async (contents) => {
   console.log("on action");
   await this.getLocation();
   let unlock = await canUnlock()
   if (this.state.isLocked) {
     if (!unlock) {
       alert('You are too far away to unlock the bike!');
       let result = await fetch("http://40b9210c.ngrok.io/lock");
       return;
     } else {
      alert('You unlocked the bike!');
      this.setState({
        isLocked: !this.state.isLocked,
        points: [],
      });
      let result = await fetch("http://40b9210c.ngrok.io/unlock");
    }
   } else {
     alert("You locked your bike!")
     await this.getPoints();
     this.setState({
       isLocked: !this.state.isLocked,
     });
     let result = await fetch("http://40b9210c.ngrok.io/lock");
   }
 }

  render() {
    return !this.state.loading && (
      <div>
        <Map
          google={this.props.google}
          zoom={18}
          style={mapStyles}
          initialCenter={this.state.marker}
        >
          {this.renderMarker()}
          {this.renderFence()}
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
