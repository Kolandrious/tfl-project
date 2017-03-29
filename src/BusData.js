import React from 'react';
import './App.css';

export default ({ onBusClick, bus }) => (
  <tr onClick={() => onBusClick(bus.id)}>
    <td title="Name">{bus.name}</td>
    <td title="Origination">{bus.routeSections[0].originationName}</td>
    <td title="Destination">{bus.routeSections[0].destinationName}</td>
  </tr>
);
