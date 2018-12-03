import React, {Component} from 'react';
//import './App.css';
import {withGoogleMap,Map, GoogleApiWrapper,Polygon, HeatMap,} from 'google-maps-react';
import {InfoWindow, Marker} from 'google-maps-react';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'semantic-ui-css/semantic.min.css'
import {
    Button,
    Dropdown
} from 'semantic-ui-react'


//slider-related variable and methods
const Handle = Slider.Handle;
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
        this.dateAry = [];
        var yesterday = "";
        for (var i = -1; i<8;i++){
            var currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + i);
            var month = '' + (currentDate.getMonth() + 1);
            var day = '' + currentDate.getDate();
            var year = currentDate.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            var str = [year, month, day].join('-');
            if (i == -1){
                yesterday = str;
            }
            else {this.dateAry.push({value: str, key: str, text:  str});}
        }

        this.dataAry = new window.google.maps.MVCArray();
        this.lastSelectedDate = yesterday;
        this.state = { //state variables
            selectedDate: this.dateAry[0]['value'] , //the selected date
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
                var weight = Math.log(item.demand);
                var point = new window.google.maps.LatLng(latMappings[indY], lngMappings[indX]);
                currentHourParsed.push({location: point, weight:weight});
            }
            positions.push(currentHourParsed);
        }
        return positions;
    }

    //date update
    handleDateChange = (e, { value }) => {
        this.setState({selectedDate: value});
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
        if (this.state.selectedDate == this.lastSelectedDate) {
            return;
        }
        this.lastSelectedDate = this.state.selectedDate;
        let url = "https://owtjarn4j7.execute-api.us-east-1.amazonaws.com/prod/rides?date="+this.state.selectedDate+"&hour=";
        var urlAry = [];
        for (var i = 0; i< 24; i++) {
            urlAry.push(url + i);
        }
        Promise.all(urlAry.map(url => fetch(url))).then(responses =>
                Promise.all(responses.map(res => res.json())
            ).then(data => {
                this.data = this.parseData2(data);
                if (this.heatmap == null){
                    var gmap = this.googlemapRef.current.map;
                    this.data[this.state.hour].forEach(element =>{
                        this.dataAry.push(element);
                    } );
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
                    this.dataAry.clear();
                    this.data[this.state.hour].forEach(element =>{
                        this.dataAry.push(element);
                    } );
                }

            }));
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
                    <Dropdown style={{ display: "inline-block"}}
                              placeholder={this.dateAry[0]['value']}
                              selection options={this.dateAry}
                              onChange= {this.handleDateChange}
                              value={this.state.selectedDate}

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
