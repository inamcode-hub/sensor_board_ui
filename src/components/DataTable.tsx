import React, { useEffect, useState, useRef } from 'react';
import './DataTableWrapper.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const DataTable = () => {
  const [items, setItems] = useState([]);
  const [calitems, setCalitems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const lastSuccessRef = useRef(Date.now());

  const getItems = async () => {
    console.log('🔄 Fetching sensor data...');
    try {
      const [crudRes, calrigRes] = await Promise.all([
        fetch(`${API_BASE}/crud`),
        fetch(`${API_BASE}/calrig`),
      ]);

      if (!crudRes.ok || !calrigRes.ok) {
        throw new Error('One or more endpoints failed to load.');
      }

      const [crudData, calrigData] = await Promise.all([
        crudRes.json(),
        calrigRes.json(),
      ]);

      console.log('✅ CRUD data:', crudData);
      console.log('✅ Calrig data:', calrigData);

      setItems(crudData);
      setCalitems(calrigData);
      setError(null);

      const now = Date.now();
      if (now - lastSuccessRef.current > 60 * 60 * 1000) {
        toast.success('✅ Sensor data received successfully.');
        lastSuccessRef.current = now;
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      if (!error) {
        toast.error(
          '⚠️ Unable to load sensor data. Please check your connection.'
        );
      }
      setError('Unable to load sensor data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
    const interval = setInterval(getItems, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderBoards = (item) => {
    return Array.from({ length: 12 }, (_, i) => {
      const aiM = `ai${i * 2 + 1}`;
      const aiT = `ai${i * 2 + 2}`;

      const mVal =
        item[aiM] && !isNaN(item[aiM]) ? parseFloat(item[aiM]).toFixed(3) : '-';
      const tVal =
        item[aiT] && !isNaN(item[aiT]) ? parseFloat(item[aiT]).toFixed(3) : '-';

      return (
        <div key={i + 1} className={`board board${i + 1}`}>
          <div className="board-label">BOARD {i + 1}</div>
          <div className="m-label">M</div>
          <div className="t-label">T</div>
          <div className="m-value">{mVal}</div>
          <div className="t-value">{tVal}</div>
        </div>
      );
    });
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
      />
      {loading ? (
        <div className="loading">Loading sensor data...</div>
      ) : error ? (
        <div className="loading">{error}</div>
      ) : !items.length ? (
        <div className="loading">No sensor data available.</div>
      ) : (
        <section className="content-area datatable-wrapper">
          {renderBoards(items[0])}
        </section>
      )}
    </>
  );
};

export default DataTable;
