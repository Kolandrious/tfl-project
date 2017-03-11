import React from 'react';
import './App.css';

export default ({ onBusClick, bus, direction }) => {
  if(!bus.routeSections[direction]) {
    return (
      <tr onClick={() => onBusClick(bus.id)}>
        <td title="Name">{bus.name}</td>
        <td title="Origination">{bus.routeSections[0].originationName}</td>
        <td title="Destination">{bus.routeSections[0].destinationName}</td>
      </tr>
    );
  }

  return (
    <tr onClick={() => onBusClick(bus.id)}>
      <td title="Name">{bus.name}</td>
      <td title="Origination">{bus.routeSections[direction].originationName}</td>
      <td title="Destination">{bus.routeSections[direction].destinationName}</td>
    </tr>
  );
}
