import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConfigureStore from './redux/store/ConfigureStore';
import App from './components/App';

const store = ConfigureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
