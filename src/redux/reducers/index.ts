import {combineReducers} from 'redux';
import demo from './demo';

/**single entry point to combine all reducers at once */
const rootReducer = combineReducers({
  demo
});
export type IRootState = ReturnType<typeof rootReducer>

export default rootReducer;
