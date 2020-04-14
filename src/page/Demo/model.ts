import { IModel, ReduxState } from '@redux/types';

const model: IModel<ReduxState['demo']> = {
  namespace: 'demo',
  state: {
    list: [1]
  },
  effects: {
    *push_async({ payload }, { delay, put }) {
      yield delay(500);
      yield put({ type: 'push', payload })
    }
  },
  reducers: {
    push(state, { payload }) {
      return { ...state, list: [...state.list, payload] };
    },
  }
}

export default model;
