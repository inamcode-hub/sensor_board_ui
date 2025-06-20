import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChartData } from '../features/redux-store/chartSlice';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import { Select, DatePicker, Button, Typography, Space, Row, Col } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const AnalyticsControlsWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.chart);

  const [interval, setInterval] = useState('1h');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [userTouchedEnd, setUserTouchedEnd] = useState(false);

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

  return (
    <div style={{ padding: '1.5rem' }}>
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
          </>
        )}

        <Col>
          <Button
            type="primary"
            onClick={handleFetch}
            loading={loading}
            icon="📥"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </Button>
        </Col>
      </Row>

      <div style={{ marginTop: '2rem' }}>{children}</div>
    </div>
  );
};

export default AnalyticsControlsWrapper;
