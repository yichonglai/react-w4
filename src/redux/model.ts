import { AnyAction, Reducer } from 'redux';
import { IAction, IModel } from './types';

/**类型定义 */
export interface IState {
  count: number;
  platformName: string;
}

const model: IModel<IState> = {
  namespace: 'global',
  state: {
    count: 0,
    platformName: 'ClauseYi'
  },
  effects: {
    *increment_async(action, { delay, put }) {
      console.log('eeeeeeeeeeeeee');

      // yield delay(2000);
      yield put({ type: 'global/increment' });
    }
  },
  reducers: {
    increment(state, action) {
      return { ...state, count: state.count + 1 };
    }
  }
}

export default model;
