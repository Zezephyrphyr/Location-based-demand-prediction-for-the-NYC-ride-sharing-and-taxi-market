import React, {Component} from 'react';
//import './App.css';
import {Map, GoogleApiWrapper} from 'google-maps-react';
import {InfoWindow, Marker} from 'google-maps-react';
import DatePicker from 'react-datepicker';
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';
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
    Label,
    Form,
    Input,
    Radio,
    Select,
    TextArea
} from 'semantic-ui-react'

//const createSliderWithTooltip = Slider.createSliderWithTooltip;

//slider-related variable and methods
const Handle = Slider.Handle;

//slider value handle
const handle = (props) => {
    const {value, dragging, index, ...restProps} = props;
    return (
        <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
        >
            <Handle value={value} {...restProps} />
        </Tooltip>
    );
};

//minimum date and maximum date for selection
const minDays = new Date(2014, 3, 1);
const maxDays = new Date(2014, 8, 30);

//map size
const mapStyles = {
    width: '100%',
    height: '100%'
};


//main class
export class MapContainer extends Component {

    //state variables
    state = {
        showingInfoWindow: false,  //Hides or the shows the infoWindow
        activeMarker: {},          //Shows the active marker upon click - map related features
        selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker - map related features
        startDate: moment("2014-06-01"), //the selected date
        hour: 12,
        lngValue: 40.8029407, //starting logitude - center of new york city
        latValue: -74.1876679, // starting latitude
        tmpt: 70, //may be removed if not necessary
        weth: 'Sunny', //may be removed if not necessary
        visible: false, //may be removed if not necessary
        data: null //heatmap data source
    };


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

    //date update
    handleDateChange = (date) => {
        this.setState({startDate: date});
    };

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!NEEDS TO BE MODIFIED FOR DATA AND HEATMAP INTEGRATION!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //hour update
    handleHourChange = (props) => {
        const {value, dragging, index,...restProps} = props;
        //if hour changed, change the variable
        if (value != Number(this.state.hour)) {this.state.hour = value};
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

    //longitude update
    handleLngChange = (event) => {
        this.setState({lngValue: event.target.value});
    };

    //latitude update
    handleLatChange = (event) => {
        this.setState({latValue: event.target.value});
    };

    //temperature update
    handleTmptChange = (event) => {
        this.setState({tmpt: event.target.value});
    };

    //weather update
    handleWethChange = (event) => {
        this.setState({weth: event.target.value});
    };

    //sidebar disploy or not button
    handleSelectionChange = (e, {checked}) => this.setState({visible: checked})

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!NEEDS TO BE MODIFIED FOR DATA AND HEATMAP INTEGRATION!!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //This method will be called on confirm button clicked and after first render
    componentDidMount = () => {
        let date = this.state.startDate; //current date
        let datestring = date.toISOString().split("T")[0]; //parsed date format for url
        alert(datestring + " hour: "+this.state.hour); // testing use only
        let url = "https://owtjarn4j7.execute-api.us-east-1.amazonaws.com/prod/rides?date="+datestring+"&hour=16";
        fetch(url).then(response => response.json()).then = (data) => {
            this.setState({data});
            //!!!!!!!MODIFY HERE FOR OPERATIONS ON DATA!!!!!!!!!
        };
    }

    //Loading Pages
    render() {
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
                                    openToDate={moment("2014-06-01")}
                                    selected={this.state.startDate}
                                    onChange={this.handleDateChange}
                                    dateFormat="ll"
                                    minDate={minDays}
                                    maxDate={maxDays}
                                />
                            </Grid.Row>
                            <Grid.Row>
                                <label>
                                    &nbsp;&nbsp;&nbsp;Longitude:&nbsp;
                                    <input type="text" value={this.state.lngValue} onChange={this.handleLngChange}/>
                                </label>
                            </Grid.Row>
                            <Grid.Row>
                                <label>
                                    &nbsp;&nbsp;&nbsp;Latitude:&nbsp;
                                    <input type="text" value={this.state.latValue} onChange={this.handleLatChange}/>
                                </label>
                            </Grid.Row>
                            <Grid.Row>
                                <label>
                                    &nbsp;&nbsp;&nbsp;Temperature:&nbsp;
                                    <input type="text" value={this.state.tmpt} onChange={this.handleTmptChange}/>
                                </label>
                            </Grid.Row>
                            <Grid.Row>
                                <label>
                                    &nbsp;&nbsp;&nbsp;Weather:&nbsp;
                                    <input type="text" value={this.state.weth} onChange={this.handleWethChange}/>
                                </label>

                            </Grid.Row>
                            <Grid.Row>
                                <label style = {{margin: 10}}>
                                    Hours:
                                </label>
                                <Slider style={{width: 270, margin: 0, display: "inline-block"}} min={0} max={24} defaultValue={12} handle={this.handleHourChange}/>
                            </Grid.Row>
                            <Grid.Row/>
                            <Button onClick = {this.componentDidMount}> Confirm </Button>
                            <Grid.Row/>
                        </Grid>
                    </Sidebar>
                    <Sidebar.Pusher dimmed={this.state.visible}>
                        <div className="MapContainer">

                            <Map
                                google={this.props.google}

                                zoom={10}
                                style={mapStyles}
                                initialCenter={{lat: 40.6974881, lng: -73.979681}}


                            >


                                <Marker
                                    onClick={this.onMarkerClick}
                                    name={'Kenyatta International Convention Centre'}
                                    position={{lat: 40.8029407, lng: -74.1876679}}
                                />


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

                    </Sidebar.Pusher>
                </Sidebar.Pushable>


            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ['AIzaSyBITWvoHqr-SOsoWrC1of17do9eXnZcSXI']
})(MapContainer);
