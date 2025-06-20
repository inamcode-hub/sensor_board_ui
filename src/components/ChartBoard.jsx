import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const ChartBoard = ({ boardNumber = 1 }) => {
  const { data, loading, error } = useSelector((state) => state.chart);

  // Skip rendering if data is empty
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

  const formatted = data.map((d) => ({
    ...d,
    timestamp: moment.tz(d.timestamp, 'America/Toronto').format('HH:mm:ss'),
    [aiM]: parseFloat(d[aiM]),
    [aiT]: parseFloat(d[aiT]),
  }));

  return (
    <div className="chart-wrapper">
      <h4>Board {boardNumber} (M & T)</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={formatted}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" interval={Math.floor(data.length / 8)} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={aiM}
            stroke="#8884d8"
            dot={false}
            name="M"
          />
          <Line
            type="monotone"
            dataKey={aiT}
            stroke="#82ca9d"
            dot={false}
            name="T"
          />
        </LineChart>
      </ResponsiveContainer>
      {loading && <div className="loading">📡 Loading data...</div>}
      {error && <div className="error">❌ Error loading data: {error}</div>}
    </div>
  );
};

export default ChartBoard;
