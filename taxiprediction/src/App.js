import React, {Component} from 'react';
//import './App.css';
import {withGoogleMap,Map, GoogleApiWrapper,Polygon, HeatMap,} from 'google-maps-react';
import {InfoWindow, Marker} from 'google-maps-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
//import PropTypes from 'prop-types';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'semantic-ui-css/semantic.min.css'
import {
    Button,
} from 'semantic-ui-react'


//slider-related variable and methods
const Handle = Slider.Handle;
//minimum date and maximum date for selection
const minDays = new Date();
const maxDays = new Date();
maxDays.setDate(minDays.getDate() + 7);

const north = 40.90493915804564;
const south = 40.48846518521376;
const east = -73.72326885045277;
const west = -74.27971341040893;

//map settings
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

const gradient = [
    'rgba(0,255,0,0)',
    'rgba(43,255,0,0)',
    'rgba(128,255,0,1)',
    'rgba(128,255,0,1)',
    'rgba(170,255,0,1)',
    'rgba(213,255,0,1)',
    'rgba(213,255,0,1)',
    'rgba(213,255,0,1)',
    'rgba(213,255,0,1)',
    'rgba(213,255,0,1)',
    'rgba(213,255,0,1)',
    'rgba(213,255,0,1)',
    'rgba(255,255,0,1)',
    'rgba(255,213,0,1)',
    'rgba(255,170,0,1)',
    'rgba(255,128,0,1)',
    'rgba(255,85,0,1)',
    'rgba(255,43,0,1)',
    'rgba(255,0,0,1)',
    'rgba(255,0,0,1)',
    'rgba(255,0,0,1)',
    'rgba(255,0,0,1)',
]

//main class
export class MapContainer extends Component {


    constructor(props){
        super(props);
        this.heatmap = null;
        this.googlemapRef = React.createRef();
        this.data = null;
      //  this.lngValue = 40.8029407;
      //  this.latValue = -74.1876679;
        this.dataAry = new window.google.maps.MVCArray();
        this.lastSelectedDate = moment().subtract(1, "days");
        this.state = { //state variables
            selectedDate: moment(), //the selected date
            hour: new Date().getHours(),
            visible: false, //may be removed if not necessary
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
                //if (weight > 1000) weight = 1000;
                //if (weight < 2) weight = 0;
                var weight = Math.log(item.demand);
                var point = new window.google.maps.LatLng(latMappings[indY], lngMappings[indX]);
                currentHourParsed.push({location: point, weight:weight});
            }
            positions.push(currentHourParsed);
        }
        return positions;
    }

    //date update
    handleDateChange = (date) => {
        this.setState({selectedDate: date});
    };

    //hour update
    handleHourChange = (props) => {
        const {value, dragging, index,...restProps} = props;
        //if hour changed, change the variable
        if (value != Number(this.state.hour)) {
            this.setState({hour: value});
            if (this.state.selectedDate == this.lastSelectedDate){
                if (this.heatmap!=null) {
                    this.dataAry.clear();
                    this.data[this.state.hour].forEach(element => {
                        this.dataAry.push(element);
                    });
                }
            }
        }
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

    }

    //This method will be called on confirm button clicked and after first render
    update = () => {
        this.setState({opacity:0.7});
        if (this.state.selectedDate.isSame(this.lastSelectedDate,'day')) {
            return;
        }
        this.lastSelectedDate = this.state.selectedDate;
        let dS = this.state.selectedDate.toArray(); //current date
        let dateString = dS[0] + "-" + (dS[1]+1) + "-" + dS[2]; //parsed date format for url
        //alert(dateString + " hour: "+this.state.hour); // testing use only
        let url = "https://owtjarn4j7.execute-api.us-east-1.amazonaws.com/prod/rides?date="+dateString+"&hour=";
        var urlAry = [];
        for (var i = 0; i< 24; i++) {
            urlAry.push(url + i);
            console.debug(url + i);
        }
        Promise.all(urlAry.map(url => fetch(url))).then(responses =>
                Promise.all(responses.map(res => res.json())
            ).then(data => {
                this.data = this.parseData2(data);
                if (this.heatmap == null){
                    var gmap = this.googlemapRef.current.map;
                    console.log(this.data);
                    this.data[this.state.hour].forEach(element =>{
                        this.dataAry.push(element);
                    } );
                    console.log(this.dataAry);
                    this.heatmap = new window.google.maps.visualization.HeatmapLayer({
                        gradient: gradient,
                        maxIntensity: 15,
                        data: this.dataAry,
                        opacity:0.5,
                        radius: 25
                    });
                    this.heatmap.setMap(gmap);
                }
                else{
                    console.log(this.data);
                    this.dataAry.clear();
                    this.data[this.state.hour].forEach(element =>{
                        this.dataAry.push(element);
                    } );
                }

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
                    <div className="MapContainer">
                            <Map
                                style={{height: '95%', width: '100%',position: 'fixed', top:40}}
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
                <div style = {{position: 'absolute', top: 0}}>
                    <label style={{ display: "inline-block"}}> Date: &nbsp; </label>
                    <DatePicker
                        openToDate={moment()}
                        selected={this.state.selectedDate}
                        onChange={this.handleDateChange}
                        dateFormat="ll"
                        minDate={minDays}
                        maxDate={maxDays}
                        style={{ display: "inline-block"}}
                    />

                    <label style = {{margin: 10, display: "inline-block"}}>
                        Hours:
                    </label>
                    <label style={{ display: "inline-block"}}> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </label>
                    <Slider style={{width: 270, margin: 0, display: "inline-block"}} min={0} max={23} defaultValue={this.state.hour} handle={this.handleHourChange}/>
                    <label style={{ display: "inline-block"}}> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </label>
                    <Button onClick = {this.update}> Confirm </Button>
                </div>


            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ['AIzaSyBITWvoHqr-SOsoWrC1of17do9eXnZcSXI'],
    libraries: ['visualization']
})(MapContainer);
