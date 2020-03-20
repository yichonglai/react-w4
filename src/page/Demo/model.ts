import { AnyAction, Reducer } from 'redux';
import {IAction, IModel} from '@redux/types';

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
    *increment(action: IAction) {
      
    }
  },
  reducers: {
    save(state: IState, action: AnyAction): IState {
      return { ...state, ...action.payload };
    },
  }
}

export default model;
