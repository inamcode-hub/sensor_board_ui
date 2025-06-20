import React from 'react';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const ZoomChartBoard = ({ boardNumber = 1 }) => {
  const { data, loading, error } = useSelector((state) => state.chart);

  const aiM = `ai${(boardNumber - 1) * 2 + 1}`;
  const aiT = `ai${(boardNumber - 1) * 2 + 2}`;

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
      id: `zoom-board-${boardNumber}`,
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
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd HH:mm:ss',
      },
    },
    colors: ['#1890ff', '#fa541c'], // Ant Design palette
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
  };

  return (
    <Card
      title={<Title level={4}>🔍 Zoom Chart - Board {boardNumber}</Title>}
      style={{ marginBottom: '1rem' }}
      bodyStyle={{ padding: '1rem' }}
    >
      {loading && <p>⏳ Loading chart data...</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
      {!loading && !data.length && <p>No data available</p>}

      {data.length > 0 && (
        <Chart options={options} series={series} type="line" height={400} />
      )}
    </Card>
  );
};

export default ZoomChartBoard;
