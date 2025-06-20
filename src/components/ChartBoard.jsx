import React from 'react';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

const ChartBoard = ({ boardNumber = 1 }) => {
  const { data, loading, error } = useSelector((state) => state.chart);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="chart-wrapper">
        <h4>Board {boardNumber} (M & T)</h4>
        <p style={{ color: 'gray' }}>No data to display</p>
      </div>
    );
  }

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
      id: `board-${boardNumber}`,
      type: 'line',
      zoom: { enabled: false },
      toolbar: { show: false },
      animations: { enabled: false },
    },
    xaxis: {
      type: 'datetime',
      labels: { datetimeUTC: false },
    },
    yaxis: {
      labels: { formatter: (val) => val.toFixed(2) },
    },
    stroke: { curve: 'smooth' },
    tooltip: {
      x: { format: 'HH:mm:ss' },
    },
    legend: { show: false },
  };

  return (
    <Link to={`/analytics/board/${boardNumber}`}>
      <div className="chart-wrapper">
        <h4>Board {boardNumber} (M & T)</h4>
        <Chart options={options} series={series} type="line" height={250} />

        {loading && <div className="loading">📡 Loading data...</div>}
        {error && <div className="error">❌ Error loading data: {error}</div>}
      </div>
    </Link>
  );
};

export default ChartBoard;
