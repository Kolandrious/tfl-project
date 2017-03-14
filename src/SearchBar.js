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
      <div className="input-group">
        <span className="input-group-addon col-1">found {this.props.results}</span>
        <input
          type="text"
          className="form-control col-11"
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
