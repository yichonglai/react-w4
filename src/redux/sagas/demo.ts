import { delay, put, takeEvery } from 'redux-saga/effects';

import { IAction } from '@redux/types';

function* increment(action: IAction) {
  console.log(action);
  console.log(arguments);

  yield delay(2000);
  yield put({ type: 'INCREMENT' })
}

/**A saga */
export default function* watchIncrement() {
  console.log(222);

  yield takeEvery('INCREMENT_ASYNC', increment)
  console.log(333);

}