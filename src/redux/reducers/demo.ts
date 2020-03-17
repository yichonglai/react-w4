import { Reducer } from 'redux';

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
      return { ...state, count: state.count + 1 };
      break;
    default:
      return state;
  }
}

export default reducer;