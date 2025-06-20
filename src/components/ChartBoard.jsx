import React from 'react';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const ChartBoard = ({ boardNumber = 1 }) => {
  const { data, loading, error } = useSelector((state) => state.chart);

  const aiM = `ai${(boardNumber - 1) * 2 + 1}`;
  const aiT = `ai${(boardNumber - 1) * 2 + 2}`;

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card
        title={`Board ${boardNumber} (M & T)`}
        bordered
        style={{ minHeight: 300 }}
      >
        <p style={{ color: 'gray' }}>No data to display</p>
      </Card>
    );
  }

  const series = [
    {
      name: 'Moisture (M)',
      data: data.map((d) => [
        new Date(d.timestamp).getTime(),
        parseFloat(d[aiM]),
      ]),
    },
    {
      name: 'Temperature (T)',
      data: data.map((d) => [
        new Date(d.timestamp).getTime(),
        parseFloat(d[aiT]),
      ]),
    },
  ];

  const options = {
    chart: {
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
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: {
      x: { format: 'HH:mm:ss' },
    },
    colors: ['#1890ff', '#fa541c'], // Ant Design blue + volcano
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
  };

  return (
    <Link to={`/analytics/board/${boardNumber}`}>
      <Card
        hoverable
        title={<Title level={5}>Board {boardNumber} (M & T)</Title>}
        style={{ width: '100%', minHeight: 300 }}
        bodyStyle={{ padding: '1rem' }}
      >
        <Chart options={options} series={series} type="line" height={250} />
        {loading && <p style={{ marginTop: 8 }}>📡 Loading...</p>}
        {error && (
          <p style={{ color: 'red', marginTop: 8 }}>❌ Error: {error}</p>
        )}
      </Card>
    </Link>
  );
};

export default ChartBoard;
