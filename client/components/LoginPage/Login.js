import React from 'react';

const Login = () => (
  <div className="container row">
    <form className="white col s6 offset-s4 black-text">
      <div className="row">
        <div className="input-field col s8">
          <i className="material-icons prefix">person</i>
          <label htmlFor="username">Username: </label>
          <input id="username" type="text" className="validate" />
        </div>
      </div><br />
      <div className="row">
        <div className="input-field col s8">
          <i className="material-icons prefix">fingerprint</i>
          <label htmlFor="password">Password: </label>
          <input id="password" type="password" className="validate" />
        </div>
      </div>
      <div className="row right">
        <div className="col s12">
          <button className="btn waves-effect waves-light" type="submit" name="action">Login
            <i className="material-icons right">send</i>
          </button>
          <span><p>Not Registered? <a href="/">SignUp Here!</a></p></span>
        </div><br />
      </div>
    </form>
  </div>);

export default Login;
