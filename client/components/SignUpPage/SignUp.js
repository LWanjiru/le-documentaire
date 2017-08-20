import React, { Component } from 'react';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    const newState = {};
    newState[event.target.id] = event.target.value;
    this.setState(newState);
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.signUp(this.state);
  }

  render() {
    console.log(this.props.apiCall);
    return (
      <div className="container row">
        <form className="white col s12 m12 l6 offset-l5 center black-text" onChange={this.onChange}>
          <div className="row">
            <div className="input-field col s8">
              <i className="material-icons prefix">person</i>
              <label htmlFor="username">Username: </label>
              <input id="username" type="text" className="validate" />
            </div><br />
          </div>
          <div className="row">
            <div className="input-field col s8">
              <i className="material-icons prefix">account_circle</i>
              <label htmlFor="firstName">FirstName: </label>
              <input id="firstName" type="text" className="validate" />
            </div>
          </div><br />
          <div className="row">
            <div className="input-field col s8">
              <i className="material-icons prefix">account_circle</i>
              <label htmlFor="lastName">LastName: </label>
              <input id="lastName" type="text" className="validate" />
            </div>
          </div><br />
          <div className="row">
            <div className="input-field col s8">
              <i className="material-icons prefix">mail_outline</i>
              <label htmlFor="email">Email: </label>
              <input id="email" type="email" className="validate" />
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
              <button onClick={this.onSubmit} className="btn waves-effect waves-light" type="submit" name="action">Register
                <i className="material-icons right">send</i>
              </button>
              <span><p>Already Registered? <a href="/login">Login Here</a></p></span>
            </div><br />
          </div>
        </form>
      </div>
    );
  }
}

export default SignUp;
