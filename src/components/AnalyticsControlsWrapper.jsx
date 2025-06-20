import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChartData } from '../features/redux-store/chartSlice';
import { toast } from 'react-toastify';

const formatDateTime = (date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

const AnalyticsControlsWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.chart);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [interval, setInterval] = useState('1h');
  const [userTouchedEnd, setUserTouchedEnd] = useState(false);

  const handleStartChange = (e) => {
    const newStartStr = e.target.value;
    setStart(newStartStr);

    if (!userTouchedEnd) {
      const newStart = new Date(newStartStr);
      const twoHoursLater = new Date(newStart.getTime() + 2 * 60 * 60 * 1000);
      const now = new Date();
      const boundedEnd = twoHoursLater > now ? now : twoHoursLater;
      setEnd(formatDateTime(boundedEnd));
    }

    if (!newStartStr) {
      setUserTouchedEnd(false);
    }
  };

  const handleEndChange = (e) => {
    setEnd(e.target.value);
    setUserTouchedEnd(true);
  };

  const handleFetch = () => {
    if (!interval || (interval !== 'raw' && (!start || !end))) {
      toast.error('Please fill all required fields.');
      return;
    }

    dispatch(fetchChartData({ start, end, interval }));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📊 Analytics View</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Interval:{' '}
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            <option value="raw">Raw (last 10)</option>
            <option value="1s">Every Second</option>
            <option value="1m">Every Minute</option>
            <option value="1h">Every Hour</option>
          </select>
        </label>{' '}
        {interval !== 'raw' && (
          <>
            <label>
              Start:{' '}
              <input
                type="datetime-local"
                value={start}
                onChange={handleStartChange}
              />
            </label>{' '}
            <label>
              End:{' '}
              <input
                type="datetime-local"
                value={end}
                onChange={handleEndChange}
              />
            </label>
          </>
        )}
        <button onClick={handleFetch} disabled={loading}>
          {loading ? '⏳ Loading...' : '📥 Fetch Data'}
        </button>
      </div>

      <div>{children}</div>
    </div>
  );
};

export default AnalyticsControlsWrapper;
