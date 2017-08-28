import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import SearchUserContainer from '../Search/SearchUsers/SearchUserContainer';

export default class Header extends Component {
  render() {
    return (
      <nav className="row">
        <div className="nav-wrapper blue darken-4">
          <a href="/" className="brand-logo left">
            <i className="material-icons prefix">track_changes</i>
            Le Documentaire
          </a>
          <div className="right">
            <ul>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
