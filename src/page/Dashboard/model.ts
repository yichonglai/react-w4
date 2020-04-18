import { RootState } from '@models/types';
import { IModel } from '@yep/index';

const model: IModel<RootState['dashboard']> = {
  namespace: 'dashboard',
  state: {
    data: [1, 2, 34]
  },
  effects: {
    *change(_, { put }) {
      yield put({ type: 'save' })
    }
  },
  reducers: {
    save(state) {
      return { ...state, data: [1] };
    }
  }
}

export default model;
