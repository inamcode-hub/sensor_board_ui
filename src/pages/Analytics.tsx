import React from 'react';
import ChartBoard from '../components/ChartBoard';
import AnalyticsControlsWrapper from '../components/AnalyticsControlsWrapper';

const Analytics = () => {
  return (
    <AnalyticsControlsWrapper>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
      >
        {[...Array(12)].map((_, i) => (
          <ChartBoard key={i} boardNumber={i + 1} />
        ))}
      </div>
    </AnalyticsControlsWrapper>
  );
};

export default Analytics;
