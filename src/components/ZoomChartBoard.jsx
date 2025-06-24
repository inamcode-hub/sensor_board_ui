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

  const minTs = data.length ? new Date(data[0].timestamp).getTime() : undefined;
  const maxTs = data.length
    ? new Date(data[data.length - 1].timestamp).getTime()
    : undefined;

  const options = {
    chart: {
      id: `zoom-board-${boardNumber}`,
      type: 'line',
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: false, // disable auto Y-scaling for consistent appearance
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
      min: minTs,
      max: maxTs,
    },
    yaxis: [
      {
        seriesName: 'Moisture (M)',
        min: 3.5,
        max: 6.0,
        title: { text: 'Moisture (M)' },
      },
      {
        opposite: true,
        seriesName: 'Temperature (T)',
        min: 1.0,
        max: 2.5,
        title: { text: 'Temperature (T)' },
      },
    ],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd HH:mm:ss',
      },
    },
    colors: ['#1890ff', '#fa541c'],
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
