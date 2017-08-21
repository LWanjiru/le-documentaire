import React, { Component } from 'react';

export default class SearchUser extends Component {
  render() {
    return (
      <nav>
        <div className="">
          <form>
            <div className="input-field container center">
              <label htmlFor="search"><i className="material-icons">search</i></label>
              <input id="search" type="search" required />
            </div>
          </form>
        </div>
      </nav>
    );
  }
}
