import {applyMiddleware, compose, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from '../../reducers/index';

const persistConfig = {
  key: 'soleSearch App',
  storage: AsyncStorage,
};

const persistRootReducer = persistReducer(persistConfig, rootReducer);
export const store = __DEV__
  ? createStore(
      persistRootReducer,
      composeEnhancers(...enhancers, Reactotron.createEnhancer()),
    )
  : createStore(persistRootReducer, compose(...enhancers));

export const persistor = persistStore(store);
