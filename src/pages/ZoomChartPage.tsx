import { useParams, useNavigate } from 'react-router-dom';
import ZoomChartBoard from '../components/ZoomChartBoard';
import AnalyticsControlsWrapper from '../components/AnalyticsControlsWrapper';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import React from 'react';

const ZoomChartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <AnalyticsControlsWrapper>
      <div style={{ marginBottom: '1rem' }}>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>

      <ZoomChartBoard boardNumber={parseInt(id || '1')} />
    </AnalyticsControlsWrapper>
  );
};

export default ZoomChartPage;
