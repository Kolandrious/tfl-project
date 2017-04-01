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
      selected: [],
      searchTerm: '',
    };
    this.setBusRoute = this.setBusRoute.bind(this);
    this.getAllBusRoutes = this.getAllBusRoutes.bind(this);
    this.search = this.search.bind(this);
    this.getAllBusRoutes();
  }

  getAllBusRoutes() {
    axios({
      method: 'get',
      url: 'https://api.tfl.gov.uk/Line/Mode/bus/Route?serviceTypes=Regular&excludeCrowding=true',
      responseType: 'json',
    }).then(data => {
      const expanded = [];
      let counter = 1;
      data.data.forEach(bus => {
        bus.routeSections.forEach(route => {
          const newRoute = route;
          newRoute.name = bus.name;
          newRoute.id = `${bus.id}`;
          newRoute.counter = `${counter}`;
          counter += 1;
          expanded.push(newRoute);
        });
      });
      this.setState(() => ({
        allRoutes: expanded,
        allData: data.data,
        filteredRoutes: expanded,
      }));
      this.setBusRoute(expanded[865]);
    });
  }

  setBusRoute(bus) {
    axios({
      method: 'get',
      url: `https://api-radon.tfl.gov.uk/Line/${bus.id}/Route/Sequence/${bus.direction
      }?serviceTypes=Regular&excludeCrowding=true`,
      responseType: 'json',
      transformResponse: [data => {
        data.lineStrings = data.lineStrings.map(linestring => (JSON.parse(linestring)));
        if (data.lineStrings.length > 1) {
          const concatenatedName = `${bus.originationName} &harr;  ${bus.destinationName}`;
          data.orderedLineRoutes.forEach((el, index) => {
            if (el.name === concatenatedName) {
              data.lineStrings = data.lineStrings[0][index];
            }
          });
        } else {
          data.lineStrings=data.lineStrings[0][0];
        }
        return data;
      }],
    }).then(data => {
      this.setState(() => ({
        selected: data.data,
      }));
    });
  }

  search(searchTerm) {
    this.setState(state => ({ filteredRoutes: state.allRoutes.filter(route =>
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.originationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destinationName.toLowerCase().includes(searchTerm.toLowerCase()),
    ) }));
  }

  render() {
    return (
      <div className="container-fluid">
        <BusMap path={this.state.selected.lineStrings} />
        <SearchBar
          results={this.state.filteredRoutes.length}
          search={term => {
            this.setState(() => ({ searchTerm: term }));
            this.search(term);
          }}
        />
        <BusList data={this.state.filteredRoutes} onBusClick={bus => this.setBusRoute(bus)} />
      </div>
    );
  }
}

