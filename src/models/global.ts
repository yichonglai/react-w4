import { RootState } from './types';
import { IModel } from 'redux-yep';

const model: IModel<RootState['global']> = {
  namespace: 'global',
  state: {
    count: 0,
    platformName: 'ClauseYi'
  },
  effects: {
    *increment_async(action, { delay, put }) {
      yield delay(1000);
      yield put({ type: 'save' });
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, count: state.count + 1 };
    }
  }
}

export default model;
