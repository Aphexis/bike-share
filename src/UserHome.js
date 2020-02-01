import React from 'react';
import './App.css';
import logo from './assets/bike-logo.png';
import {Button} from 'react-bootstrap';
import {Map, GoogleApiWrapper} from 'google-maps-react';
import {Component} from 'react';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {
  render() {
    return (
      <div>
        <div>
          <Map
            google={this.props.google}
            zoom={14}
            style={mapStyles}
            initialCenter={{
             lat: -1.2884,
             lng: 36.8233
            }}
          />
        </div>
        <div className="lock-btn-cont">
          <Button id="lock-btn" variant="success"><b>Lock</b></Button>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAjuuYihkBjfoZKhjfK9Rwavf5mhrIlULc'
})(MapContainer);
