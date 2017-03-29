import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import BusList from './BusList';
import BusMap from './BusMap';
import SearchBar from './SearchBar';
import './App.css';

export default class App extends React.Component {
  static filterDataByDirection(data, direction) {
    const newData = [];
    data.forEach(el => {
      const newEl = _.cloneDeep(el);
      if (newEl.routeSections.some(section => section.direction === direction)) {
        newEl.routeSections = newEl.routeSections.filter(section => (
          section.direction === direction
        ));
        newData.push(newEl);
      }
    });
    return newData;
  }

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
    this.search = this.search.bind(this);
    this.getAllBusRoutes();
    this.setBusRouteById('1');
  }

  getAllBusRoutes() {
    axios({
      method: 'get',
      url: 'https://api.tfl.gov.uk/Line/Mode/bus/Route?serviceTypes=Regular',
      responseType: 'json',
    }).then(data => {
      this.setState({
        allRoutes: App.filterDataByDirection(data.data, this.state.direction),
        allData: data.data,
        filteredRoutes: App.filterDataByDirection(data.data, this.state.direction),
      });
    });
  }

  setBusRouteById(id) {
    axios({
      method: 'get',
      url: `https://api-radon.tfl.gov.uk/Line/${id}/Route/Sequence/all?serviceTypes=Regular&excludeCrowding=true`,
      responseType: 'json',
      transformResponse: [data => {
        data.lineStrings = data.lineStrings.map(el => (JSON.parse(el)[0]));
        return data;
      }],
    }).then(data => {
      let route = data.data.lineStrings[0];
      if (data.data.lineStrings.length > 1) {
        route = (this.state.direction === 'inbound' ? data.data.lineStrings[0]
                                                    : data.data.lineStrings[1]);
      }
      this.setState({
        selectedData: data.data,
        selectedRoute: route,
      });
    });
  }


  changeDirection() {
    this.setState(state => {
      const direction = state.direction === 'inbound' ? 'outbound' : 'inbound';
      const directionNumber = state.direction === 'inbound' ? 1 : 0;
      return {
        direction,
        selectedRoute: this.state.selectedData.lineStrings[directionNumber],
        allRoutes: App.filterDataByDirection(this.state.allData, direction),
      };
    });
    this.search(this.state.searchTerm);
  }

  search(searchTerm) {
    this.setState(state => ({ filteredRoutes: state.allRoutes.filter(el =>
      el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.routeSections[0].name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) }));
  }

  render() {
    return (
      <div className="container-fluid">
        <BusMap path={this.state.selectedRoute} />
        <button
          className="btn btn-block"
          onClick={() => this.changeDirection()}
        >
          change direction, current: {this.state.direction}
        </button>
        <SearchBar
          results={this.state.filteredRoutes.length}
          search={term => {
            this.setState(() => ({ searchTerm: term }));
            this.search(term);
          }}
        />
        <BusList data={this.state.filteredRoutes} onBusClick={id => this.setBusRouteById(id)} />
      </div>
    );
  }
}

