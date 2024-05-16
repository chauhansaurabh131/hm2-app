import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import Reactotron from '../../ReactotronConfig';
import rootReducer from './reducers';
import rootSaga from './sagas';

const middleware = [];
const enhancers = [];

// Create the Saga middleware
const sagaMonitor = Reactotron.createSagaMonitor();
const sagaMiddleware = __DEV__
  ? createSagaMiddleware({sagaMonitor})
  : createSagaMiddleware();
middleware.push(sagaMiddleware);

// Add Saga middleware to the middleware array
enhancers.push(applyMiddleware(...middleware));

// Create the Redux store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = __DEV__
  ? createStore(
      rootReducer,
      composeEnhancers(...enhancers, Reactotron.createEnhancer()),
    )
  : createStore(rootReducer, compose(...enhancers));

// Run the Saga middleware
if (__DEV__) {
  Reactotron.log('sagaMiddleware.run(rootSaga)');
  store.runSaga = sagaMiddleware.run;
  store.runSaga(rootSaga);
} else {
  sagaMiddleware.run(rootSaga);
}

export default store;
