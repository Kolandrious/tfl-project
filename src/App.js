import React from 'react';
import axios from 'axios';
import BusList from './BusList';
import BusMap from './BusMap.js';
import './App.css';

// const APP_ID = 'b45e91a3';
// const APP_KEY = '8f6cdc23bf6c563423ec0146b6a669e2';

// ADD inbound & outbound toggle

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      path: [],
      direction: 'inbound'
    }
    this.getBusRouteById = this.getBusRouteById.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.getBusRouteById('2');
  }

  getBusRouteById(id) {
    axios({
      method: 'get',
      url: `https://api-radon.tfl.gov.uk/Line/${id}/Route/Sequence/all?serviceTypes=Regular&excludeCrowding=true`,
      responseType: 'json'
    }).then((data) => {
      data.data.lineStrings.forEach((el, index) => {
        data.data.lineStrings[index] = JSON.parse(el)[0];
      });
      console.log(data);
      const path = this.state.direction === 'inbound' ? data.data.lineStrings[0] : data.data.lineStrings[1]
      this.setState({
        data: data.data,
        path: path
      });
    });
  }
  changeDirection(){
    console.log(this.state.data);
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
        <BusMap path={this.state.path}/>
        <button onClick={() => this.changeDirection()}>change direction, current: {this.state.direction}</button>
        <BusList />
      </div>
    );
  }
}
