import { AnyAction, Reducer } from 'redux';
import { IAction, IModel } from '@redux/types';

/**类型定义 */
export interface IState {
  count: number;
}

const model: IModel<IState> = {
  namespace: 'demo',
  state: {
    count: 0
  },
  effects: {
    *svae_async() {
      console.log('gggggggggggggggg');
    }
  },
  reducers: {
    save(state, action) {
      return { ...state, count: state.count + 1 };
    },
  }
}

export default model;
