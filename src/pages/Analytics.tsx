import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChartBoard from '../components/ChartBoard';
import { fetchChartData } from '../features/redux-store/ChartSlice';
import { toast } from 'react-toastify';

const Analytics = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.chart);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [interval, setInterval] = useState('1s');

  const handleFetch = () => {
    if (!interval || (interval !== 'raw' && (!start || !end))) {
      toast.error('⚠️ Please fill in all required fields.');
      return;
    }

    dispatch(fetchChartData({ start, end, interval }));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Analytics Dashboard</h2>

      {/* === Filter Bar === */}
      <div
        style={{
          marginBottom: '1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <label>
          Interval:{' '}
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            <option value="raw">Raw (Last 10)</option>
            <option value="1s">Every Second</option>
            <option value="1m">Every Minute</option>
            <option value="1h">Every Hour</option>
          </select>
        </label>

        {interval !== 'raw' && (
          <>
            <label>
              Start:{' '}
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </label>
            <label>
              End:{' '}
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </label>
          </>
        )}

        <button onClick={handleFetch} disabled={loading}>
          {loading ? '⏳ Loading...' : '📥 Fetch Data'}
        </button>
      </div>

      {/* === Chart Grid === */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
      >
        {[...Array(12)].map((_, i) => (
          <ChartBoard key={i} boardNumber={i + 1} />
        ))}
      </div>
    </div>
  );
};

export default Analytics;
