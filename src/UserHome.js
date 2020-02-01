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
var bike_id = "test";
var userId = "ElleHacks";

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

 onAction = (contents) => {

   if (this.state.isLocked) {
     this.getLocation();
   }

   this.setState({
     isLocked: !this.state.isLocked,
   });
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
