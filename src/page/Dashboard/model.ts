import { IModel, RootState } from '@redux/types';

const model: IModel<RootState['dashboard']> = {
  namespace: 'dashboard',
  state: {
    data: [1, 2, 34]
  },
}

export default model;
