import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { Card, Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const ZoomChartBoard = () => {
  const { boardId } = useParams();
  const boardNumber = parseInt(boardId, 10) || 1;
  const { data, loading, error } = useSelector((state) => state.chart);

  const aiM = `ai${(boardNumber - 1) * 2 + 1}`;
  const aiT = `ai${(boardNumber - 1) * 2 + 2}`;

  const cleanData = useMemo(() => {
    return Array.isArray(data)
      ? data.filter(
          (d) =>
            d.timestamp &&
            !isNaN(parseFloat(d[aiM])) &&
            !isNaN(parseFloat(d[aiT]))
        )
      : [];
  }, [data, aiM, aiT]);

  const valuesM = cleanData.map((d) => parseFloat(d[aiM]));
  const valuesT = cleanData.map((d) => parseFloat(d[aiT]));

  const minM = Math.min(...valuesM);
  const maxM = Math.max(...valuesM);
  const minT = Math.min(...valuesT);
  const maxT = Math.max(...valuesT);

  const paddingM = 0.05;
  const paddingT = 0.05;

  // Detect Moisture Spikes (Δ > 0.02 within 1–2s window)
  const annotations = useMemo(() => {
    const points = [];
    let spikeIndex = 1;
    let warningIndex = 1;

    const enrichedData = cleanData.map((d) => ({
      ts: new Date(d.timestamp).getTime(),
      m: parseFloat(d[aiM]),
    }));

    for (let i = 0; i < enrichedData.length; i++) {
      const { ts: t1, m: m1 } = enrichedData[i];
      for (let j = i + 1; j < enrichedData.length; j++) {
        const { ts: t2, m: m2 } = enrichedData[j];
        const dt = t2 - t1;
        const dm = Math.abs(m2 - m1);

        if (dt > 2000) break;

        if (dt >= 1000 && dm > 0.02) {
          points.push({
            x: t2,
            y: m2,
            marker: {
              size: 6,
              fillColor: '#fa541c',
              strokeColor: '#000',
              strokeWidth: 2,
            },
            label: {
              borderColor: '#fa541c',
              style: {
                color: '#fff',
                background: '#fa541c',
                fontSize: '12px',
                fontWeight: 500,
              },
              text: `Spike #${spikeIndex}: Δ${dm.toFixed(3)}`,
              offsetY: -10,
            },
          });
          spikeIndex++;
          break;
        }

        if (dt >= 1000 && dm > 0.015 && dm <= 0.02) {
          points.push({
            x: t2,
            y: m2,
            marker: {
              size: 6,
              fillColor: '#fa8c16',
              strokeColor: '#000',
              strokeWidth: 2,
            },
            label: {
              borderColor: '#fa8c16',
              style: {
                color: '#fff',
                background: '#fa8c16',
                fontSize: '12px',
                fontWeight: 500,
              },
              text: `Close #${warningIndex}: Δ${dm.toFixed(3)}`,
              offsetY: -10,
            },
          });
          warningIndex++;
          break;
        }
      }
    }

    return { points };
  }, [cleanData, aiM]);

  const series = [
    {
      name: 'Moisture (M)',
      data: cleanData.map((d) => [
        new Date(d.timestamp).getTime(),
        parseFloat(d[aiM]),
      ]),
    },
    {
      name: 'Temperature (T)',
      data: cleanData.map((d) => [
        new Date(d.timestamp).getTime(),
        parseFloat(d[aiT]),
      ]),
    },
  ];

  const minTs = cleanData.length
    ? new Date(cleanData[0].timestamp).getTime()
    : undefined;
  const maxTs = cleanData.length
    ? new Date(cleanData[cleanData.length - 1].timestamp).getTime()
    : undefined;

  const options = {
    chart: {
      id: `zoom-board-${boardNumber}`,
      type: 'line',
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: false,
      },
      toolbar: {
        autoSelected: 'zoom',
        tools: {
          download: true,
          reset: true,
        },
      },
      animations: { enabled: false },
    },
    annotations,
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
        min: minM - paddingM,
        max: maxM + paddingM,
        title: { text: 'Moisture (M)' },
      },
      {
        opposite: true,
        seriesName: 'Temperature (T)',
        min: minT - paddingT,
        max: maxT + paddingT,
        title: { text: 'Temperature (T)' },
      },
    ],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    markers: {
      size: 1,
      strokeWidth: 0,
      hover: {
        sizeOffset: 3,
      },
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
      title={
        <Title level={4}>
          🔍 Zoom Chart - Board {boardNumber}{' '}
          {annotations.points.length > 0 &&
            `(Spikes: ${annotations.points.length})`}
        </Title>
      }
      style={{ marginBottom: '1rem' }}
      bodyStyle={{ padding: '1rem' }}
    >
      {loading && <p>⏳ Loading chart data...</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
      {!loading && !data.length && <p>No data available</p>}

      {cleanData.length > 0 && (
        <Chart options={options} series={series} type="line" height={400} />
      )}
    </Card>
  );
};

export default ZoomChartBoard;
