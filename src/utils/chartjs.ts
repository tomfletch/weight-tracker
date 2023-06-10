/* eslint-disable import/prefer-default-export */
import { Chart, registerables } from 'chart.js';
import { formatDate } from './dates';

const showLabelPlugin = {
  id: 'showlabel',
  afterDraw(chart: Chart) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      if (!dataset.showLabel) {
        return;
      }

      const meta = chart.getDatasetMeta(datasetIndex);
      const firstIndex = dataset.data.findIndex((d) => d);
      const point = meta.data[firstIndex];

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

export function createTooltip({ chart }: { chart: Chart}) {
  // Tooltip Element
  let tooltipEl = document.getElementById('chartjsTooltip');

  // Create element on first render
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjsTooltip';
    document.body.appendChild(tooltipEl);
  }

  // Hide if no tooltip
  const tooltipModel = chart.tooltip;
  if (!tooltipModel || tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = '0';
    return;
  }

  const date = new Date(chart.tooltip.dataPoints[0].parsed.x);

  // Set Text
  if (tooltipModel.body) {
    const bodyLines = tooltipModel.body.map((bodyItem) => bodyItem.lines);

    let innerHtml = `<div class="date">${formatDate(date)}</div>`;

    bodyLines.forEach((body, i) => {
      innerHtml += `<div>${body}</div>`;
    });

    tooltipEl.innerHTML = innerHtml;
  }

  const position = chart.canvas.getBoundingClientRect();
  // const bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);

  // Display, position, and set styles for font
  tooltipEl.style.opacity = '1';
  tooltipEl.style.position = 'absolute';
  tooltipEl.style.left = `${position.left + window.pageXOffset + tooltipModel.caretX}px`;
  tooltipEl.style.top = `${position.top + window.pageYOffset + tooltipModel.caretY}px`;
  // tooltipEl.style.font = bodyFont.string;
  // tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
  tooltipEl.style.pointerEvents = 'none';
}
