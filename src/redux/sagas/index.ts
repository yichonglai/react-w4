import {all, call} from 'redux-saga/effects';

import demo from './demo';

/**single entry point to start all Sagas at once ---middleware */
export default function* rootSaga() {
  yield all([
    call(demo),
  ]);
}