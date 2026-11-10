import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Log2Scale } from 'components/Chart/scales';

import { LineChartHighlight } from './plugins/LineChartHighlight';

export function registerChartModules() {
  // Do not register plugins in global scope.
  ChartJS.register(
    BarElement,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    BarController,
    LineController,
    Log2Scale,
    annotationPlugin,
    LineChartHighlight,
    Title,
    Tooltip,
    Legend,
    Filler,
  );
}
