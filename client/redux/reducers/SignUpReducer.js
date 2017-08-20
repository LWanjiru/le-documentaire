import { signUpTypes } from '../actions/SignUpAction';

const DEFAULT_STATE = {
  message: '',
};
export default function reducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case signUpTypes.SIGNUP_REQUEST:
      return {
        ...state,
      };
    case signUpTypes.SIGNUP_REQUEST_SUCCESS:
      return {
        ...state,
        message: action.payload.body.message,
      };
    case signUpTypes.SIGNUP_REQUEST_FAIL:
      return {
        ...state,
        message: action.payload.response.body.message,
      };
    default:
      return state;
  }
}
