import React from 'react';
import './App.css';

export default ({ onBusClick, bus }) => (
  <tr onClick={() => onBusClick(bus)}>
    <td title="Name">{bus.name}</td>
    <td title="Origination">{bus.originationName}</td>
    <td title="Destination">{bus.destinationName}</td>
  </tr>
);
