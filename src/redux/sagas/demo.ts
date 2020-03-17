import { delay, put, takeEvery } from 'redux-saga/effects'

function* increment() {
  yield delay(2000);
  yield put({ type: 'INCREMENT' })
}

/**A saga */
export default function* watchIncrement() {
  console.log(222);
  
  yield takeEvery('INCREMENT_ASYNC', increment)
}