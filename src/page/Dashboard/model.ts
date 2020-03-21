import { AnyAction, Reducer } from 'redux';
import { IAction, IModel } from '@redux/types';

/**类型定义 */
export interface IState {
  data: number[];
}

const model: IModel<IState> = {
  namespace: 'dashboard',
  state: {
    data: [1, 2, 34,]
  },
  effects: {

  },
  reducers: {

  }
}

export default model;
