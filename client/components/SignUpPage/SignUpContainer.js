import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SignUp from './SignUp';
import signUp from '../../redux/actions/SignUpAction';
import { apiCallState } from '../../redux/reducers/ApiReducer';

class SignUpContainer extends Component {
  render() {
    return (
      <div>
        <SignUp apiCall={this.props.apiCall} signUp={this.props.signUp} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const apiCall = apiCallState(state);
  return ({
    apiCall,
  });
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    signUp,
  }, dispatch)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUpContainer);
