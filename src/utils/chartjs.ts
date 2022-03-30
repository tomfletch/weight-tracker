import { Chart, registerables } from 'chart.js';

const showLabelPlugin = {
  id: 'showlabel',
  afterDraw(chart: Chart) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (!dataset.showLabel) {
        return;
      }

      const meta = chart.getDatasetMeta(datasetIndex);
      const point = meta.data[0];

      const colour = meta.dataset?.options.borderColor;

      if (typeof colour === 'string') {
        ctx.fillStyle = colour;
      } else {
        ctx.fillStyle = 'red';
      }

      const labelX = point.x + 2;
      let labelY = point.y - 2;
      ctx.textBaseline = 'bottom';

      if (point.y < 30) {
        ctx.textBaseline = 'top';
        labelY = point.y + 2;
      }

      ctx.fillText(meta.label, labelX, labelY);
    });
  },
};

Chart.register(...registerables);
Chart.register(showLabelPlugin);
