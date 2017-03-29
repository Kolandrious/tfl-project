import React from 'react';
import BusData from './BusData';
import './App.css';

export default props => (
  <div>
    <table className="table table-condensed table-hover">
      <thead className="thead-default">
        <tr>
          <th>#</th>
          <th>Origination</th>
          <th>Destination</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map(el => (
          <BusData
            key={el.id}
            onBusClick={props.onBusClick}
            bus={el}
          />
        ))}
      </tbody>
    </table>
  </div>
);
