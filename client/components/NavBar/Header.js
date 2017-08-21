import React, { Component } from 'react';
import SearchUserContainer from '../Search/SearchUsers/SearchUserContainer';

export default class Header extends Component {
  render() {
    return (
      <nav className="row">
        <div className="nav-wrapper blue darken-4">
          <a href="/" className="brand-logo left">
            <i className="material-icons prefix">track_changes</i>
            Le Documentaire
          </a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><SearchUserContainer /></li>
            <li>
              <div className="row col s12">
                <button onClick="" className="waves-effect waves-light btn-large blue right" type="submit" name="action">Login
                </button>
              </div><br />
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
