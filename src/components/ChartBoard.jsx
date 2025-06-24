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

  // Guard clause for no data
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

  // Filter out entries with valid moisture/temperature
  const cleanData = data.filter(
    (d) =>
      d.timestamp && !isNaN(parseFloat(d[aiM])) && !isNaN(parseFloat(d[aiT]))
  );

  // Moisture spike detection: if any two consecutive readings within 1s differ by > 0.02
  const hasMoistureSpike = () => {
    for (let i = 1; i < cleanData.length; i++) {
      const prev = cleanData[i - 1];
      const curr = cleanData[i];
      const timeDiff = new Date(curr.timestamp) - new Date(prev.timestamp);
      const mDiff = Math.abs(parseFloat(curr[aiM]) - parseFloat(prev[aiM]));
      if (timeDiff <= 1000 && mDiff > 0.02) {
        return true;
      }
    }
    return false;
  };

  const boardFailed = hasMoistureSpike();

  const series = [
    {
      name: 'Moisture (M)',
      type: 'line',
      data: cleanData.map((d) => [
        new Date(d.timestamp).getTime(),
        parseFloat(d[aiM]),
      ]),
    },
    {
      name: 'Temperature (T)',
      type: 'line',
      data: cleanData.map((d) => [
        new Date(d.timestamp).getTime(),
        parseFloat(d[aiT]),
      ]),
    },
  ];

  const options = {
    chart: {
      type: 'line',
      fontFamily:
        'Roboto, Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      zoom: { enabled: false },
      toolbar: { show: false },
      animations: { enabled: false },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        formatter: (val) => moment.tz(val, 'America/Toronto').format('HH:mm'),
      },
      title: {
        text: 'Time (Toronto)',
      },
    },
    yaxis: [
      {
        seriesName: 'Moisture (M)',
        title: { text: 'Moisture (M)' },
        min: 3.5,
        max: 5.9,
        labels: { formatter: (val) => val.toFixed(2) },
      },
      {
        opposite: true,
        seriesName: 'Temperature (T)',
        title: { text: 'Temperature (T)' },
        min: 1.0,
        max: 2.4,
        labels: { formatter: (val) => val.toFixed(2) },
      },
    ],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    tooltip: {
      shared: true,
      x: {
        format: 'yyyy-MM-dd HH:mm:ss',
        formatter: (val) =>
          moment.tz(val, 'America/Toronto').format('YYYY-MM-DD HH:mm:ss z'),
      },
    },
    colors: ['#1890ff', '#fa541c'],
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
    },
  };

  return (
    <Link to={`/analytics/board/${boardNumber}`}>
      <Card
        hoverable
        title={
          <Title
            level={5}
            style={{ color: boardFailed ? '#a8071a' : '#096dd9' }}
          >
            Board {boardNumber} (M & T) {boardFailed ? '❌ FAIL' : '✅ PASS'}
          </Title>
        }
        style={{
          width: '100%',
          minHeight: 300,
          backgroundColor: boardFailed ? '#fff1f0' : undefined,
          borderColor: boardFailed ? '#ffa39e' : undefined,
        }}
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
