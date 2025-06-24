import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChartData } from '../features/redux-store/chartSlice';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import DownloadCSVButton from './DownloadCSVButton'; // adjust path if needed

import {
  Select,
  DatePicker,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Divider,
} from 'antd';
import DownloadTestReportButton from './DownloadTestReportButton';

const { Title, Text } = Typography;
const { Option } = Select;

const STORAGE_KEY = 'dm_test_start_time';

const AnalyticsControlsWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { loading, data } = useSelector((state) => state.chart);

  const [interval, setInterval] = useState('1h');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [userTouchedEnd, setUserTouchedEnd] = useState(false);
  const [savedStart, setSavedStart] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = dayjs(stored);
      if (parsed.isValid()) {
        setSavedStart(parsed);
      }
    }
  }, []);

  const handleStartChange = (value) => {
    setStart(value);
    if (!userTouchedEnd && value) {
      const autoEnd = value.add(2, 'hour');
      const now = dayjs();
      setEnd(autoEnd.isAfter(now) ? now : autoEnd);
    }
  };

  const handleEndChange = (value) => {
    setEnd(value);
    setUserTouchedEnd(true);
  };

  const handleFetch = () => {
    if (!interval || (interval !== 'raw' && (!start || !end))) {
      toast.error('❗ Please fill all required fields.');
      return;
    }

    dispatch(
      fetchChartData({
        interval,
        start: start?.format('YYYY-MM-DDTHH:mm'),
        end: end?.format('YYYY-MM-DDTHH:mm'),
      })
    );
  };

  const saveStartToLocal = () => {
    if (!start) {
      toast.error('❌ Set a start date first.');
      return;
    }
    localStorage.setItem(STORAGE_KEY, start.toISOString());
    setSavedStart(start);
    toast.success('✅ Test start time saved.');
  };

  const useSavedStart = () => {
    if (!savedStart) {
      toast.warn('⚠️ No saved time found.');
      return;
    }

    const now = dayjs();
    const autoEnd = savedStart.add(2, 'hour');
    const endValue = autoEnd.isAfter(now) ? now : autoEnd;

    setStart(savedStart);
    setEnd(endValue);
    setUserTouchedEnd(false);

    toast.success('📌 Start and end auto-filled.');
  };

  return (
    <div style={{ padding: '0rem' }}>
      <Title level={3}>📊 Analytics View</Title>
      <Row gutter={[16, 16]} align="middle">
        <Col>
          <Select
            value={interval}
            onChange={setInterval}
            style={{ width: 180 }}
          >
            <Option value="raw">Raw (last 10)</Option>
            <Option value="1s">Every Second</Option>
            <Option value="1m">Every Minute</Option>
            <Option value="1h">Every Hour</Option>
          </Select>
        </Col>

        {interval !== 'raw' && (
          <>
            <Col>
              <DatePicker
                showTime
                value={start}
                onChange={handleStartChange}
                maxDate={dayjs()}
                placeholder="Start date/time"
              />
            </Col>
            <Col>
              <DatePicker
                showTime
                value={end}
                onChange={handleEndChange}
                maxDate={dayjs()}
                placeholder="End date/time"
              />
            </Col>
            <Col>
              <Button onClick={useSavedStart} disabled={!savedStart}>
                📌 Use Saved Start
              </Button>
            </Col>
            <Col>
              <Button onClick={saveStartToLocal} disabled={!start}>
                🧠 Save This Start
              </Button>
            </Col>
          </>
        )}

        <Col style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Button
            type="primary"
            onClick={handleFetch}
            loading={loading}
            icon="📥"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </Button>
          {data && data.length > 0 && <DownloadCSVButton />}
          {data.length > 0 && <DownloadTestReportButton />}
        </Col>
      </Row>
      {savedStart && (
        <Row style={{ marginTop: '0.5rem' }}>
          <Col>
            <Text type="secondary">
              🧠 Last saved start:{' '}
              <strong>{savedStart.format('YYYY-MM-DD HH:mm')}</strong>
            </Text>
          </Col>
        </Row>
      )}
      <Divider />
      hi
      <div style={{ marginTop: '1rem' }}>{children}</div>
    </div>
  );
};

export default AnalyticsControlsWrapper;
