import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  applyMiddleware,
  compose,
  legacy_createStore as createStore,
} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../index';
import rootSaga from '../../saga';

const middleware = [];
const enhancers = [];

const persistConfig = {
  key: 'Happy milan',
  storage: AsyncStorage,
};

const sagaMiddleware = createSagaMiddleware({
  onError: (error, errorInfo) => {
    console.log('Saga error caught:', error, errorInfo);
    // This prevents the error from crashing all sagas
  },
});

middleware.push(sagaMiddleware);

enhancers.push(applyMiddleware(...middleware));

const persistRootReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistRootReducer, compose(...enhancers));

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);
