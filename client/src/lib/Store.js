import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/index';

const middlewares = [
  thunkMiddleware,
];

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  	middlewares.push(logger);
}

let store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
