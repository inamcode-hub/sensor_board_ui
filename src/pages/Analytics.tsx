import React from 'react';
import ChartBoard from '../components/ChartBoard';
import AnalyticsControlsWrapper from '../components/AnalyticsControlsWrapper';
import { Row, Col } from 'antd';

const Analytics = () => {
  return (
    <AnalyticsControlsWrapper>
      <div style={{ padding: '0rem' }}>
        <Row gutter={[16, 16]}>
          {[...Array(12)].map((_, i) => (
            <Col key={i} xs={24} sm={12} md={6}>
              <ChartBoard boardNumber={i + 1} />
            </Col>
          ))}
        </Row>
      </div>
    </AnalyticsControlsWrapper>
  );
};

export default Analytics;
