import { IModel, ReduxState } from '@redux/types';

const model: IModel<ReduxState['dashboard']> = {
  namespace: 'dashboard',
  state: {
    data: [1, 2, 34]
  },
}

export default model;
