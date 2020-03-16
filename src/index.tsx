import '@assets/styles/reset.less';

import {Provider} from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from '@router/index';
import store from '@redux/index';

// if (module.hot) {
//   module.hot.accept('router', () => {
//     const Router = require('router').default;
//     ReactDOM.render(<Router />, document.getElementById('root'));
//   });
// }

ReactDOM.render(<Provider store={store}><Router /></Provider>, document.getElementById('root'));