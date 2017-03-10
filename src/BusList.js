import React from 'react';
import BusData from './BusData';

export default ({ data, direction, ...props }) => {
  if (direction === 'inbound') {
    direction = 0;
  } else {
    direction = 1;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
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
  );
}
