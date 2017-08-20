import { combineReducers } from 'redux';
import SignUpReducer from '../reducers/SignUpReducer';
import ApiReducer from '../reducers/ApiReducer';

const RootReducer = combineReducers({
  SignUpReducer,
  ApiReducer,
});

export default RootReducer;
