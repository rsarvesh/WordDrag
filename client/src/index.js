import React from 'react'
import ReactDOM from 'react-dom'
import App from './App';
import { Provider } from 'react-redux';
import store from './lib/Store';

const is_dev = process.env.NODE_ENV === 'development';
let baseUrl = '';
baseUrl = is_dev ? `http://localhost:4000` : `${window.location.protocol}//${window.location.host}`;

ReactDOM.render(
    <Provider store={store}>
         <App baseUrl={baseUrl} />
    </Provider>, 
    document.getElementById('root')
)
