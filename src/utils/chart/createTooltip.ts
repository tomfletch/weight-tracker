import type { Chart } from 'chart.js';
import { formatDate } from '../dates';

export function createTooltip({ chart }: { chart: Chart }) {
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

  const parsedX = chart.tooltip.dataPoints[0].parsed.x;
  if (parsedX === null) return;
  const date = new Date(parsedX);

  // Set Text
  if (tooltipModel.body) {
    const bodyLines = tooltipModel.body.map((bodyItem) => bodyItem.lines);

    let innerHtml = `<div class="date">${formatDate(date)}</div>`;

    bodyLines.forEach((body) => {
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
