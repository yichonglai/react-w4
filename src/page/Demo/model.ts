import { IModel, RootState } from '@redux/types';

const model: IModel<RootState['demo']> = {
  namespace: 'demo',
  state: {
    list: [1]
  },
  effects: {
    async: {
      loading: 'wwwww',
      *worker({ payload }, { delay, put }) {
        yield delay(1000);
        yield put({ type: 'save', payload })
      }
    },
    *push_async({ payload }, { delay, put }) {
      yield delay(1000);
      // yield put({ type: 'save', payload })
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, list: [...state.list, payload] };
    },
  }
}

export default model;
