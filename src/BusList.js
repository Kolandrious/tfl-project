import React from 'react';
import BusData from './BusData';
import './App.css';

export default ({ data, direction, ...props }) => {
  if (direction === 'inbound') {
    direction = 0;
  } else {
    direction = 1;
  }

  return (
    <div >
      <table className="table table-condensed table-hover">
        <thead className="thead-default">
          <tr>
            <th>#</th>
            <th>Origination</th>
            <th>Destination</th>
          </tr>
        </thead>
        <tbody>
          {data.map(el => {
            return (
              <BusData
                key={el.id}
                onBusClick={props.onBusClick}
                bus={el}
                direction={direction}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
