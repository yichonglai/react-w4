import {combineReducers} from 'redux';
import demo from './demo';

const reducers = {
  demo
}
// RootSate 问题
/**single entry point to bind all reducers at once ---reducers */
export default combineReducers(reducers);
