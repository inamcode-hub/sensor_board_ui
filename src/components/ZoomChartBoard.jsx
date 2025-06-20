import React from 'react';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';

const ZoomChartBoard = ({ boardNumber = 1 }) => {
  const { data, loading, error } = useSelector((state) => state.chart);

  const aiM = `ai${(boardNumber - 1) * 2 + 1}`;
  const aiT = `ai${(boardNumber - 1) * 2 + 2}`;

  const series = [
    {
      name: 'M',
      data: data.map((d) => [
        new Date(d.timestamp).getTime(),
        parseFloat(d[aiM]),
      ]),
    },
    {
      name: 'T',
      data: data.map((d) => [
        new Date(d.timestamp).getTime(),
        parseFloat(d[aiT]),
      ]),
    },
  ];

  const options = {
    chart: {
      id: 'sensor-chart',
      type: 'line',
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          download: true,
          reset: true,
        },
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toFixed(2),
      },
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd HH:mm:ss',
      },
    },
    stroke: {
      curve: 'smooth',
    },
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>🔍 Zoom Chart - Board {boardNumber}</h3>
      {loading && <p>⏳ Loading chart data...</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
      {!loading && !data.length && <p>No data available</p>}

      {!loading && data.length > 0 && (
        <Chart options={options} series={series} type="line" height={400} />
      )}
    </div>
  );
};

export default ZoomChartBoard;
