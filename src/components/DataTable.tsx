import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDatatableData } from '../features/redux-store/dataTableSlice';
import { Card, Tag, Typography, Row, Col, Space } from 'antd';
import {
  ClockCircleOutlined,
  FireOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const { Text } = Typography;

const DataTable = () => {
  const dispatch = useDispatch();
  const { crudData } = useSelector((state) => state.dataTable);

  const intervalRef = useRef(null);
  const failureRef = useRef(0);
  const lastToastRef = useRef(null);
  const runningRef = useRef(false);
  const [timestamp, setTimestamp] = useState(null);

  const fetchAndRetry = async () => {
    if (runningRef.current) return;
    runningRef.current = true;

    try {
      await dispatch(fetchDatatableData()).unwrap();
      setTimestamp(new Date());

      const now = Date.now();
      const cooldown = 10 * 60 * 1000;
      if (!lastToastRef.current || now - lastToastRef.current > cooldown) {
        toast.success('✅ Sensor data received successfully.', {
          toastId: 'sensor-success',
        });
        lastToastRef.current = now;
      }

      failureRef.current = 0;
      scheduleNext(1000);
    } catch {
      failureRef.current += 1;
      const delay = failureRef.current === 1 ? 5000 : 10000;
      toast.error('⚠️ Sensor data fetch failed', { toastId: 'sensor-error' });
      scheduleNext(delay);
    } finally {
      runningRef.current = false;
    }
  };

  const scheduleNext = (delay: number) => {
    clearTimeout(intervalRef.current);
    intervalRef.current = setTimeout(fetchAndRetry, delay);
  };

  useEffect(() => {
    fetchAndRetry();
    return () => clearTimeout(intervalRef.current);
  }, []);

  const renderBoards = (item) =>
    Array.from({ length: 12 }, (_, i) => {
      const aiM = `ai${i * 2 + 1}`;
      const aiT = `ai${i * 2 + 2}`;
      const mVal = parseFloat(item[aiM] || 0).toFixed(3);
      const tVal = parseFloat(item[aiT] || 0).toFixed(3);

      return (
        <Col key={i} xs={24} sm={12} md={8} lg={6}>
          <Card
            bordered={false}
            style={{
              background: 'linear-gradient(135deg, #d0f0e0, #e8fcf8)', // light mint-teal gradient
              padding: '0.75rem 1rem',
              borderRadius: '16px 16px 0 0',
              borderBottom: '1px solid #c6f6d5',
              backgroundImage: `repeating-linear-gradient(
    45deg,
    rgba(0, 128, 128, 0.05),
    rgba(0, 128, 128, 0.05) 1px,
    transparent 1px,
    transparent 6px
  )`,
              fontWeight: 600,
              letterSpacing: 0.5,
              color: '#004d40',
              fontFamily: 'monospace',
            }}
            title={
              <div
                style={{
                  background: 'linear-gradient(180deg, #f4fefc, #e0f7fa)',
                  padding: '1rem',
                  borderRadius: '0 0 16px 16px',
                  borderTop: 'none',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.03)',
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: '16px',
                    color: '#08123d',
                    textShadow: '0 0 1px rgba(47,84,235,0.2)',
                  }}
                >
                  BOARD {i + 1}
                </Text>
              </div>
            }
            headStyle={{ padding: 0, border: 'none' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Row justify="space-between" align="middle">
                <Col>
                  <Space direction="horizontal" align="center">
                    <ExperimentOutlined style={{ color: '#1890ff' }} />
                    <Text style={{ fontSize: 14, color: '#595959' }}>
                      Moisture
                    </Text>
                  </Space>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: '#1890ff',
                      marginTop: 4,
                    }}
                  >
                    {mVal}
                  </div>
                </Col>
                <Col>
                  <Space direction="horizontal" align="center">
                    <FireOutlined style={{ color: '#fa541c' }} />
                    <Text style={{ fontSize: 14, color: '#595959' }}>
                      Temperature
                    </Text>
                  </Space>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: '#fa541c',
                      marginTop: 4,
                    }}
                  >
                    {tVal}
                  </div>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>
      );
    });

  return (
    <div style={{ padding: '1rem' }}>
      {timestamp && (
        <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
          <Tag color="success" icon={<ClockCircleOutlined />}>
            Last updated: {dayjs(timestamp).format('HH:mm:ss')}
          </Tag>
        </div>
      )}
      {crudData.length > 0 && (
        <Row gutter={[16, 16]}>{renderBoards(crudData[0])}</Row>
      )}
    </div>
  );
};

export default DataTable;
