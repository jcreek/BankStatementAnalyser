import loadServiceWorker from './loadServiceWorker';
import Chart from 'chart.js/auto';

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

const ctx: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('myChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

if (process.env.NODE_ENV === 'production') {
  loadServiceWorker();
}
