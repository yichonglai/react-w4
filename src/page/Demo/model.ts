import { IModel } from '@redux/types';

/**类型定义 */
export interface IState {
  list: number[];
}

const model: IModel<IState> = {
  namespace: 'demo',
  state: {
    list: []
  },
  effects: {
    *push_async({payload}, {delay, put}) {
      yield delay(500);
      yield put({type: 'push', payload})
    } 
  },
  reducers: {
    push(state, {payload}) {
      return { ...state, list: [...state.list, payload] };
    },
  }
}

export default model;
