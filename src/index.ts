import loadServiceWorker from './loadServiceWorker';
import loadBankData from './loadBankData';
import generateCharts from './generateCharts';

require('./assets/favicon.ico');
require('./assets/android-chrome-192x192.png');
require('./assets/android-chrome-512x512.png');
require('./assets/apple-touch-icon.png');
require('./assets/favicon-16x16.png');
require('./assets/favicon-32x32.png');
require('./styles/main.scss');
require('./styles/buttons.scss');
require('./styles/modal.scss');
require('./styles/spinner.scss');

if (localStorage.hasOwnProperty('bankData')) {
  loadBankData(JSON.parse(localStorage.getItem('bankData')).values);
  generateCharts();
}



if (process.env.NODE_ENV === 'production') {
  loadServiceWorker();
}
