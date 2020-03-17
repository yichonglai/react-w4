import {Reducer} from 'redux';

/**类型定义 */
export interface IState {
  count: number;
}
/**初始化state */
const initState: IState = {
  count: 0,
};

/**reducer */
const reducer: Reducer<IState> = (state = initState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      ++ state.count;
      return {...state};
    default:
      return state;
  }
}

export default reducer;