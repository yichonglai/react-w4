import '@assets/styles/reset.less';

import React from 'react';
import ReactDOM from 'react-dom';
import Router from '@router/index';

// if (module.hot) {
//   module.hot.accept('router', () => {
//     const Router = require('router').default;
//     ReactDOM.render(<Router />, document.getElementById('root'));
//   });
// }

ReactDOM.render(<Router />, document.getElementById('root'));