// add selected route info

import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import BusList from './BusList';
import BusMap from './BusMap';
import SearchBar from './SearchBar';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

// const APP_ID = 'b45e91a3';
// const APP_KEY = '8f6cdc23bf6c563423ec0146b6a669e2';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allData: {},
      allRoutes: [],
      filteredRoutes: [],
      selectedData: {},
      selectedRoute: [],
      direction: 'inbound',
      searchTerm: '',
    };
    this.setBusRouteById = this.setBusRouteById.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.getAllBusRoutes = this.getAllBusRoutes.bind(this);
    this.filterDataByDirection = this.filterDataByDirection.bind(this);
    this.search = this.search.bind(this);
    this.getAllBusRoutes();
    this.setBusRouteById('1');
  }

  getAllBusRoutes() {
    axios({
      method: 'get',
      url: 'https://api.tfl.gov.uk/Line/Mode/bus/Route?serviceTypes=Regular',
      responseType: 'json'
    }).then(data => {
      this.setState({
        allRoutes: this.filterDataByDirection(data.data, this.state.direction),
        allData: data.data,
        filteredRoutes: this.filterDataByDirection(data.data, this.state.direction)
      });
    });
  }

  filterDataByDirection(data, direction) {
    let newData = [];
    data.forEach(el => {
      let newEl = _.cloneDeep(el);
      if (newEl.routeSections.some(section => {
        return section.direction === direction
      })) {
        let newRouteSections = [];
        newEl.routeSections.forEach(section => {
          if (section.direction === direction) {
            newRouteSections.push(section);
          }
        });
      newEl.routeSections = newRouteSections;
      newData.push(newEl);
      }
    })
    return newData;
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
      let route = data.data.lineStrings[0]
      if (data.data.lineStrings.length > 1) {
        route = this.state.direction === 'inbound' ?
                     data.data.lineStrings[0] :
                     data.data.lineStrings[1];
      }
      this.setState({
        selectedData: data.data,
        selectedRoute: route
      });
    });
  }

  changeDirection() {
    this.setState((state, props) => {
      const direction = state.direction === 'inbound' ? 'outbound' : 'inbound';
      const directionNumber = state.direction === 'inbound' ? 1 : 0;
      return {
        direction,
        selectedRoute: this.state.selectedData.lineStrings[directionNumber],
        allRoutes: this.filterDataByDirection(this.state.allData, direction),
      }
    });
    this.search(this.state.searchTerm);
  }

  search(searchTerm) {
    this.setState((state) => {
      const filteredRoutes = [];
      const allRoutes = state.allRoutes;
      allRoutes.forEach((el) => {
        if (el.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          filteredRoutes.push(el);
        }
        else if (el
                   .routeSections[0]
                   .name.toLowerCase()
                   .includes(searchTerm.toLowerCase())) {
          filteredRoutes.push(el);
        }
      });
      return { filteredRoutes }
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <BusMap path={this.state.selectedRoute} />
        <button
          className="btn btn-block"
          onClick={() => {
            this.changeDirection();
          }}>
          change direction, current: {this.state.direction}
        </button>
        <SearchBar
          results={this.state.filteredRoutes.length}
          search={(term) => {
            this.setState(() => {
              return {searchTerm: term}
            });
            this.search(term);
          }}
        />
        <BusList data={this.state.filteredRoutes} onBusClick={id => this.setBusRouteById(id)}/>
      </div>
    );
  }
}
