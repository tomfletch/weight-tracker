import type { Chart, ChartDataset } from 'chart.js';

export const gradientPlugin = {
  id: 'gradient',
  afterLayout(chart: Chart) {
    const { ctx, chartArea } = chart;
    const dataset = chart.data.datasets[0] as unknown as ChartDataset & {
      fill?: boolean;
    };

    if (!dataset || !chartArea || !dataset.fill) return;

    const borderColor = dataset.borderColor;
    if (typeof borderColor !== 'string') return;

    // Create gradient from top (line) to bottom (axis)
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom,
    );
    gradient.addColorStop(0, `${borderColor}55`); // Semi-transparent at the line
    gradient.addColorStop(1, `${borderColor}00`); // Fade to transparent

    dataset.backgroundColor = gradient;
    dataset.fill = true;
  },
};
