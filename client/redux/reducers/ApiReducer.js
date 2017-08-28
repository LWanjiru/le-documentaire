import { signUpTypes } from '../actions/SignUpAction';

const DEFAULT_STATE = {
  loading: false,
  success: false,
  error: false,
};

export const apiCallState = state => state.ApiReducer;

export default function reducer(state = DEFAULT_STATE, action = {}) {
  switch (action.type) {
    case signUpTypes.SIGNUP_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: false,
      };
    case signUpTypes.SIGNUP_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: false,
      };
    case signUpTypes.SIGNUP_REQUEST_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: true,
      };
    default:
      return state;
  }
}
