import React from 'react';

export default class SearchBar extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      term: ''
    }
  }


  render() {
    return (
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search!"
          value={this.state.term}
          onChange={event => {
            this.setState({ term: event.target.value });
            this.props.search(event.target.value);
          }}
        />
      </div>
    );
  }
}
