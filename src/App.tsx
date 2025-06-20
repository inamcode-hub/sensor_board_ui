import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import ZoomChartPage from './pages/ZoomChartPage'; // ⬅️ Add this import
import Layout from './components/Layout';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route
          path="/analytics/board/:boardId"
          element={<ZoomChartPage />}
        />{' '}
        {/* ⬅️ New route */}
      </Routes>
    </Layout>
  );
};

export default App;
