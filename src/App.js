import React from 'react';
import axios from 'axios';
import BusList from './BusList';
import BusMap from './BusMap.js';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

// const APP_ID = 'b45e91a3';
// const APP_KEY = '8f6cdc23bf6c563423ec0146b6a669e2';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      path: [],
      allRoutes: [],
      direction: 'inbound'
    };
    this.setBusRouteById = this.setBusRouteById.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.getAllBusRoutes = this.getAllBusRoutes.bind(this);
    this.getAllBusRoutes();
    this.setBusRouteById('2');
  }

  getAllBusRoutes() {
    axios({
      method: 'get',
      url: 'https://api.tfl.gov.uk/Line/Mode/bus/Route?serviceTypes=Regular',
      responseType: 'json'
    }).then(data => {
      this.setState({ allRoutes: data.data });
    });
  }

  setBusRouteById(id) {
    axios({
      method: 'get',
      url: `https://api-radon.tfl.gov.uk/Line/${id}/Route/Sequence/all?serviceTypes=Regular&excludeCrowding=true`,
      responseType: 'json',
      transformResponse: [data => {
        const newData = data;
        newData.lineStrings.forEach((el, index) => {
          newData.lineStrings[index] = JSON.parse(el)[0];
        });
        return newData;
      }],
    }).then(data => {
      console.log(data);
      const path = this.state.direction === 'inbound' ?
                   data.data.lineStrings[0] :
                   data.data.lineStrings[1];
      this.setState({
        data: data.data,
        path
      });
    });
  }

  changeDirection() {
    // console.log(this.state.data);
    if (this.state.direction === 'inbound') {
      this.setState({
        direction: 'outbound',
        path: this.state.data.lineStrings[1]
      });
    } else {
      this.setState({
        direction: 'inbound',
        path: this.state.data.lineStrings[0]
      });
    }
  }

  render() {
    return (
      <div>
        <BusMap path={this.state.path} />
        <button className="btn btn-block" onClick={() => this.changeDirection()}>
          change direction, current: {this.state.direction}
        </button>
        <BusList data={this.state.allRoutes} direction={this.state.direction} onBusClick={id => this.setBusRouteById(id)}/>
      </div>
    );
  }
}
