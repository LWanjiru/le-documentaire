import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import ConfigureStore from './redux/store/ConfigureStore';
import App from './components/App';

const store = ConfigureStore();

render(
  <BrowserRouter>
    <Provider store={store}>
      <Route path="/" component={App} />
    </Provider>
  </BrowserRouter>, document.getElementById('root'));
