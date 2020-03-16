import {compose} from 'redux';
import {DispatchProp} from 'react-redux';
// import {IRootState} from "@redux/reducers";

declare global {
  // redux类型定义
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
  type DispatchProp = DispatchProp;
  interface Action {
    type: string;
  }


  declare module "*.xml" {
    const content: any;
    export default content;
  }
  declare module "*.jpg" {
    const content: any;
    export default content;
  }
  declare module "*.jpeg" {
    const content: any;
    export default content;
  }
  declare module "*.png" {
    const content: any;
    export default content;
  }
  declare module "*.gif" {
    const content: any;
    export default content;
  }
  declare module "*.less" {
    const content: any;
    export default content;
  }
  declare module "*.css" {
    const content: any;
    export default content;
  }
  declare module "*.scss" {
    const content: any;
    export default content;
  }
}

