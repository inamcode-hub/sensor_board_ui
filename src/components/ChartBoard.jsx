import React, { useMemo } from 'react';
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

  // Compute spike detection only when data changes
  const { boardFailed, spikeCount, cleanData } = useMemo(() => {
    if (loading || error || !Array.isArray(data) || data.length === 0) {
      return { boardFailed: false, spikeCount: 0, cleanData: [] };
    }

    const filtered = data
      .filter(
        (d) =>
          d.timestamp &&
          !isNaN(parseFloat(d[aiM])) &&
          !isNaN(parseFloat(d[aiT]))
      )
      .map((d) => ({
        ts: new Date(d.timestamp).getTime(),
        raw: d,
        m: parseFloat(d[aiM]),
      }));

    let spikes = 0;

    for (let i = 0; i < filtered.length; i++) {
      const { ts: t1, m: m1 } = filtered[i];
      for (let j = i + 1; j < filtered.length; j++) {
        const { ts: t2, m: m2 } = filtered[j];
        const dt = t2 - t1;
        const dm = Math.abs(m2 - m1);

        if (dt > 2000) break; // outside 1-2s window
        if (dt >= 1000 && dm > 0.02) {
          spikes++;
          break; // avoid multiple counts from same base
        }
      }
    }

    return {
      boardFailed: spikes > 0,
      spikeCount: spikes,
      cleanData: filtered.map(({ raw }) => raw), // return original objects for chart
    };
  }, [data, loading, error, boardNumber]);

  if (!Array.isArray(cleanData) || cleanData.length === 0) {
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
            Board {boardNumber} (M & T){' '}
            {boardFailed
              ? `❌ FAIL - ${spikeCount} Spike${spikeCount > 1 ? 's' : ''}`
              : '✅ PASS'}
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
