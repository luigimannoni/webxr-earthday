import { combineReducers } from 'redux';
import appReducers from './app';
import uiReducers from './ui';

export default combineReducers({
  app: appReducers,
  ui: uiReducers,
});
