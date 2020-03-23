import { IModel } from './types';

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
