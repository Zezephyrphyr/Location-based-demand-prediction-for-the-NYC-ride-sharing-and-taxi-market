import React, {Component} from 'react';
//import './App.css';
import {withGoogleMap,Map, GoogleApiWrapper,Polygon, HeatMap,} from 'google-maps-react';
import {InfoWindow, Marker} from 'google-maps-react';
import DatePicker from 'react-datepicker';
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
//import PropTypes from 'prop-types';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'semantic-ui-css/semantic.min.css'
import {
    Button,
    Checkbox,
    Grid,
    Header,
    Segment,
    Sidebar,
} from 'semantic-ui-react'


//slider-related variable and methods
const Handle = Slider.Handle;
//minimum date and maximum date for selection
const minDays = new Date();
const maxDays = new Date();
maxDays.setDate(minDays.getDate() + 7);

const gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
];


const north = 40.90493915804564;
const south = 40.48846518521376;
const east = -73.72326885045277;
const west = -74.27971341040893;


const N = 30;
var latUnit = (north-south)/N;
var lngUnit = (east-west)/N;

var latMappings = [];
var lngMappings = [];
for (var x = 0; x<N; x++) {
    lngMappings[x] = west + (x+0.5)*lngUnit;
}
for (var y = 0; y<N;y++){
    latMappings[y] = south + (y+0.5)*latUnit;
}

//testing setup
/*
var positions = [];
for (var z = 0; z<24;z++) {
    var currentHour = [];
    for (x = 0; x<N; x++){
        for (y = 0; y<N; y++){
            for (var w = 0; w< x; w++) {
                currentHour.push({lat: latMappings[y], lng: lngMappings[x]});
            }
        }
    }
    positions.push(currentHour);
}
*/
/*
//parse 24*900 array to 24 weighted positions
function parseData(data){
    var positions = [];
    for (var i = 0; i<24; i++){
        var currentHourData = data[i];
        var currentHourParsed = [];
        for (var j = 0; j<N*N;j++){
            var item = currentHourData[j];
            var indX = item.x;
            var indY = item.y;
            var weight = Math.round(item.demand*10)-12;
            if (weight > 100) weight = 100;
            if (weight < 0) weight = 0;
            for (var k = 0; k<weight;k++){
                currentHourParsed.push({lat: latMappings[indY], lng: lngMappings[indX], weight:i});
            }
        }
        positions.push(currentHourParsed);
    }
    return positions;
}
*/

//main class
export class MapContainer extends Component {


    constructor(props){
        super(props);
        this.heatmap = null;
        this.googlemapRef = React.createRef();
        this.    //state variables
            state = {
            showingInfoWindow: false,  //Hides or the shows the infoWindow
            activeMarker: {},          //Shows the active marker upon click - map related features
            selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker - map related features
            selectedDate: moment(), //the selected date
            lastSelectedDate: moment().subtract(1, "days"),
            hour: new Date().getHours(),
            lngValue: 40.8029407, //starting logitude - center of new york city
            latValue: -74.1876679, // starting latitude
            visible: false, //may be removed if not necessary
            data: null,
            lastHour: new Date().getHours()
        };
        this.update();
    }

    componentWillUnmount () {
        clearTimeout(this.timeout)
    }

    parseData2(data){
        var positions = [];
        for (var i = 0; i<24; i++){
            var currentHourData = data[i];
            var currentHourParsed = [];
            for (var j = 0; j<N*N;j++){
                var item = currentHourData[j];
                var indX = item.x;
                var indY = item.y;
                var weight = item.demand;
                if (weight > 100) weight = 5000;
                if (weight < 0) weight = 0;
                var point = new window.google.maps.LatLng(latMappings[indY], lngMappings[indX]);
                currentHourParsed.push({location: point, weight:weight});
            }
            positions.push(currentHourParsed);
        }
        return positions;
    }

    componentWillMount =  () => {
        //var data = this.update();
        //this.setState({data : data});
    };
    /*
    //map related functions
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
    */

    //date update
    handleDateChange = (date) => {
        this.setState({selectedDate: date});
    };

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!NEEDS TO BE MODIFIED FOR DATA AND HEATMAP INTEGRATION!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //hour update
    handleHourChange = (props) => {
        const {value, dragging, index,...restProps} = props;
        //if hour changed, change the variable
        if (value != Number(this.state.hour)) { this.state.hour = value; }
        return (
            <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={value}
                visible={dragging}
                placement="top"
                key={index}
            >
                <Handle value={value} {...restProps}/>
            </Tooltip>
        );

        //!!!!!NEEDS TO BE MODIFIED!!!!!
        //CHANGE MAP ON HOUR CHANGE
    }

    //sidebar disploy or not button
    handleSelectionChange = (e, {checked}) => this.setState({visible: checked})

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!NEEDS TO BE MODIFIED FOR DATA AND HEATMAP INTEGRATION!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //This method will be called on confirm button clicked and after first render
    update = () => {
        this.setState({opacity:0.7});
        if (this.state.selectedDate.isSame(this.state.lastSelectedDate,'day')) {
            alert("Previous Hour: " + this.state.lastHour + "; This Hour: " + this.state.hour);
            if (this.state.hour == this.state.lastHour){
                return;
            }
            else {
                this.heatmap.setMap(null);
                var gmap = this.googlemapRef.current.map;
                this.heatmap = new window.google.maps.visualization.HeatmapLayer({
                    maxIntensity: 1000,
                    data: this.state.data[this.state.hour],
                    opacity:0.5,
                    radius:15
                });
                this.heatmap.setMap(gmap);
                this.setState({lastHour: this.state.hour});
                return;
            }
        }
        this.setState({lastHour: this.state.hour});
        this.setState({lastSelectedDate: this.state.selectedDate});
        let dS = this.state.selectedDate.toArray(); //current date
        let dateString = dS[0] + "-" + (dS[1]+1) + "-" + dS[2]; //parsed date format for url
        alert(dateString + " hour: "+this.state.hour); // testing use only
        let url = "https://owtjarn4j7.execute-api.us-east-1.amazonaws.com/prod/rides?date="+dateString+"&hour=";
        var urlAry = [];
        for (var i = 0; i< 24; i++) {
            urlAry.push(url + i);
            console.debug(url + i);
        }
        Promise.all(urlAry.map(url => fetch(url))).then(responses =>
                Promise.all(responses.map(res => res.json())
            ).then(data => {
                var result2 = this.parseData2(data);
                this.setState({data:result2});
                var gmap = this.googlemapRef.current.map;
                console.log(gmap);
                //console.log(result2);
                if (this.heatmap!=null){
                    this.heatmap.setMap(null);
                }
                this.heatmap = new window.google.maps.visualization.HeatmapLayer({
                        maxIntensity: 1000,
                        data: this.state.data[this.state.hour],
                        opacity:0.5,
                        radius:15
                });
                this.heatmap.setMap(gmap);
            }));
        /*
        fetch(url+"1")
            .then(response => response.json())
            .then(json => console.log(json));
           */

    }


    //Loading Pages
    render() {
        var points = [
            { lat: 40.90493915804564, lng: -73.72326885045277 },
            { lat: 40.90493915804564, lng: -74.27971341040893 },
            { lat: 40.48846518521376, lng: -73.72326885045277 },
            { lat: 40.48846518521376, lng: -73.72326885045277 }
        ]
        var bounds = new this.props.google.maps.LatLngBounds();
        for (var i = 0; i < points.length; i++) {
            bounds.extend(points[i]);
        }

        return (
            <div className="All">
                <Checkbox checked={this.state.visible} label='Show Selection' onChange={this.handleSelectionChange}
                          toggle/>
                <Sidebar.Pushable as={Segment} style = {{height:'100vh'}}>
                    <Sidebar
                        as={Segment}
                        animation={'overlay'}
                        direction={'left'}
                        visible={this.state.visible}
                        style = {{width:320}}

                    >
                        <Grid textAlign='center'>
                            <Grid.Row>
                                <Header as='h3'>Customer Density Map</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <label> Date: &nbsp; </label>
                                <DatePicker
                                    openToDate={moment()}
                                    selected={this.state.selectedDate}
                                    onChange={this.handleDateChange}
                                    dateFormat="ll"
                                    minDate={minDays}
                                    maxDate={maxDays}
                                />
                            </Grid.Row>
                            <Grid.Row>
                                <label style = {{margin: 10}}>
                                    Hours:
                                </label>
                                <Slider style={{width: 270, margin: 0, display: "inline-block"}} min={0} max={24} defaultValue={this.state.hour} handle={this.handleHourChange}/>
                            </Grid.Row>
                            <Grid.Row/>
                            <Button onClick = {this.update}> Confirm </Button>
                            <Grid.Row/>
                        </Grid>
                    </Sidebar>
                    <Sidebar.Pusher dimmed={this.state.visible}>
                        <div className="MapContainer">

                            <Map
                                style={{height: '100%', width: '100%', position: 'relative'}}
                                className='map'
                                google={this.props.google}
                                ref={this.googlemapRef}
                                zoom={10}
                                initialCenter={{
                                    lat: 40.7128,
                                    lng: -74.0060
                                }}
                                bounds={bounds}
                            >
                            </Map>


                        </div>

                    </Sidebar.Pusher>
                </Sidebar.Pushable>


            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ['AIzaSyBITWvoHqr-SOsoWrC1of17do9eXnZcSXI'],
    libraries: ['visualization']
})(MapContainer);
