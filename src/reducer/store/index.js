import AsyncStorage from '@react-native-async-storage/async-storage';
import {applyMiddleware, compose, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import Reactotron from '../../../ReactotronConfig';
import rootReducer from '../../reducer/index';
import rootSaga from '../../saga/index';

const middleware = [];
const enhancers = [];

const persistConfig = {
  key: 'Happy Milan',
  storage: AsyncStorage,
};

const sagaMonitor = Reactotron.createSagaMonitor();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = __DEV__
  ? createSagaMiddleware({sagaMonitor})
  : createSagaMiddleware();
middleware.push(sagaMiddleware);

enhancers.push(applyMiddleware(...middleware));

const persistRootReducer = persistReducer(persistConfig, rootReducer);

export const store = __DEV__
  ? createStore(
      persistRootReducer,
      composeEnhancers(...enhancers, Reactotron.createEnhancer()),
    )
  : createStore(persistRootReducer, compose(...enhancers));

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
