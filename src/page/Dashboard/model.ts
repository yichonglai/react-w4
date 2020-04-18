import { RootState } from '@models/types';
import { IModel } from '@yep/index';

const model: IModel<RootState['dashboard']> = {
  namespace: 'dashboard',
  state: {
    data: [1, 2, 34]
  },
}

export default model;
