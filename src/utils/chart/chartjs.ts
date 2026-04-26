import { Chart, registerables } from 'chart.js';
import { gradientPlugin } from './gradientPlugin';
import { showLabelPlugin } from './showLabelPlugin';

Chart.register(...registerables);
Chart.register(showLabelPlugin);
Chart.register(gradientPlugin);
