import { useParams } from 'react-router-dom';
import ZoomChartBoard from '../components/ZoomChartBoard';
import AnalyticsControlsWrapper from '../components/AnalyticsControlsWrapper';

const ZoomChartPage = () => {
  const { id } = useParams();

  return (
    <AnalyticsControlsWrapper>
      <ZoomChartBoard boardNumber={parseInt(id || '1')} />
    </AnalyticsControlsWrapper>
  );
};

export default ZoomChartPage;
