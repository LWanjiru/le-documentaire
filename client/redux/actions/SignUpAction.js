import Request from 'superagent';

export const signUpTypes = {
  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
  SIGNUP_REQUEST_SUCCESS: 'SIGNUP_REQUEST_SUCCESS',
  SIGNUP_REQUEST_FAIL: 'SIGNUP_REQUEST_FAIL',
};

export function signUpRequest() {
  return {
    type: signUpTypes.SIGNUP_REQUEST,
  };
}

export function signUpRequestSuccess(message) {
  return {
    type: signUpTypes.SIGNUP_REQUEST_SUCCESS,
    payload: message,
  };
}

export function signUpRequestFail(error) {
  return {
    type: signUpTypes.SIGNUP_REQUEST_FAIL,
    payload: error,
  };
}

export default function signUp(user) {
  return (dispatch) => {
    dispatch(signUpRequest());
    Request.post('http://localhost:8000/users')
      .send(user)
      .then((response) => {
        dispatch(signUpRequestSuccess(response));
      })
      .catch((message) => {
        dispatch(signUpRequestFail(message));
      });
  };
}
