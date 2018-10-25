  import React, { Component } from 'react';
  //import './App.css';
  import { Map, GoogleApiWrapper } from 'google-maps-react';
  import { InfoWindow, Marker } from 'google-maps-react';

const noteStyles = {
   backgroundColor: 'black',
   color: 'white',
}

  const mapStyles = {
    width: '80%',
    height: '100%'
  };

    document.body.style.background = 'black';



  export class MapContainer extends Component {


    state = {
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeMarker: {},          //Shows the active marker upon click
      selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
    };

    onMarkerClick = (props, marker, e) =>
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });

    onClose = props => {
      if (this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        });
      }
    };





    render() {
      return (
        <div className = "Note" style = {noteStyles}>

          <h2>Location-based demand prediction for the NYC ride-sharing and taxi market</h2>

          <h3>Notes</h3>
          <ol>
          <li>I'm currently using my goolg api key, it has limit up to 25000 map loads and 2500 requests per day.
          Be careful of the testing please, thanks！T.T </li>
          <li>We are using react.js and corresponding google map library for developing.</li>
          </ol>

          <h3>To Do</h3>
            <ol>
              <li>NYC Marker Map </li>
              <li>Side bar</li>
              <li>Filtering</li>
            </ol>

          <h3>Instructions</h3>
            <ol>
              <li>Install react.js following
              http://medium.com/web-tutorials-club/reactjs-with-create-react-app-and-sublime-text-984e7fb46455 </li>
              <li>Go to the project folder, Install google-maps-react following
              https://github.com/fullstackreact/google-maps-react</li>
              <li>Run by "npm start" (save changes of codes and it will automatically show) </li>
            </ol>

          <h3>Tutorials</h3>
            <ol>
              <li>https://scotch.io/tutorials/react-apps-with-the-google-maps-api-and-google-maps-react#toc-conclusion </li>
            </ol>

          <div className = "MapContainer">

            <Map
              google={this.props.google}

              zoom={10}
              style={mapStyles}
              initialCenter={{ lat: 40.6974881, lng: -73.979681 }}


            >


              <Marker
                onClick={this.onMarkerClick}
                name={'Kenyatta International Convention Centre'}
                position={{lat: 40.8029407, lng: -74.1876679}}
              />
              <Marker
                onClick={this.onMarkerClick}
              title={'Marker1.'}
              name={'Marker1'}
              position={{lat: 40.8029407, lng: -74.2076679}} />
              <Marker
                onClick={this.onMarkerClick}
              name={'Marker2'}
              position={{lat: 40.8029407, lng: -74.2276679}} />




              <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}
              >

                <div>
                  <h4>{this.state.selectedPlace.name}</h4>
                </div>

              </InfoWindow>

            </Map>

          </div>


        </div>
       );
    }
  }

  export default GoogleApiWrapper({
    apiKey: ['AIzaSyBITWvoHqr-SOsoWrC1of17do9eXnZcSXI']
  })(MapContainer);
