import React from 'react';
import './App.css';
import logo from './assets/bike-logo.png';
import {Button} from 'react-bootstrap';
import {Map, GoogleApiWrapper, Marker, Polygon} from 'google-maps-react';
import {Component} from 'react';
import logoMarker from './assets/bike-marker.png';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      stores:[{lat: 55.00045659754565, lng: 10},
      {latitude: 55.00044782415184, longitude: 10.000087724470847},
      {latitude: 55.000421841127014, longitude: 10.000172077739476},
      {latitude: 55.00037964698426, longitude: 10.00024981815708},
      {latitude: 55.0003228632208, longitude: 10.000317958203006},
      {latitude: 55.00025367200483, longitude: 10.000373879293504},
      {latitude: 55.000174732315976, longitude: 10.000415432412426},
      {latitude: 55.00008907776221, longitude: 10.000441020696718},
      {latitude: 55, longitude: 10.000449660802959},
      {latitude: 54.99991092223779, longitude: 10.000441020696718},
      {latitude: 54.999825267684024, longitude: 10.000415432412426},
      {latitude: 54.99974632799517, longitude: 10.000373879293504},
      {latitude: 54.9996771367792, longitude: 10.000317958203006},
      {latitude: 54.99962035301574, longitude: 10.00024981815708},
      {latitude: 54.999578158872986, longitude: 10.000172077739476},
      {latitude: 54.99955217584816, longitude: 10.000087724470847},
      {latitude: 54.99954340245435, longitude: 10},
      {latitude: 54.99955217584816, longitude: 9.999912275529153},
      {latitude: 54.999578158872986, longitude: 9.999827922260524},
      {latitude: 54.99962035301574, longitude: 9.99975018184292},
      {latitude: 54.9996771367792, longitude: 9.999682041796994},
      {latitude: 54.99974632799517, longitude: 9.999626120706496},
      {latitude: 54.999825267684024, longitude: 9.999584567587574},
      {latitude: 54.99991092223779, longitude: 9.999558979303282},
      {latitude: 55, longitude: 9.999550339197041},
      {latitude: 55.00008907776221, longitude: 9.999558979303282},
      {latitude: 55.000174732315976, longitude: 9.999584567587574},
      {latitude: 55.00025367200483, longitude: 9.999626120706496},
      {latitude: 55.0003228632208, longitude: 9.999682041796994},
      {latitude: 55.00037964698426, longitude: 9.99975018184292},
      {latitude: 55.000421841127014, longitude: 9.999827922260524},
      {latitude: 55.00044782415184, longitude: 9.999912275529153},
      {latitude: 55.00045659754565, longitude: 10}]
    }
  }


  displayMarkers = () => {
    return this.state.stores.map((store, index) => {
      return <Marker key={index} id={index} position={{ // icon={logoMarker}
       lat: store.latitude,
       lng: store.longitude
     }}
     onClick={() => console.log("")} />
   })
 }

 displayArea = () => {
   // this has to loop and close on itself
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

  render() {
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={8}
          style={mapStyles}
          initialCenter={{ lat: 47.444, lng: -122.176}}
        >
          {this.displayMarkers()}
          {this.displayArea()}
        </Map>
        <div className="lock-btn-cont">
          <Button id="lock-btn" variant="success"><b>Lock</b></Button>
        </div>
      </div>
    );
  }

  // render() {
  //   return (
  //     <div>
  //       <div>
  //         <Map
  //           google={this.props.google}
  //           zoom={14}
  //           style={mapStyles}
  //           initialCenter={{
  //            lat: 43.472222,
  //            lng: -80.544722
  //          }} >
  //          {this.displayMarkers()}
  //          // <Marker position={{lat: 43.472222, lng: -80.544722}} />
  //         </Map>
  //       </div>
  //
  //     </div>
  //   );
  // }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAjuuYihkBjfoZKhjfK9Rwavf5mhrIlULc'
})(MapContainer);
