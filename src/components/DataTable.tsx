import React, { useEffect, useRef } from 'react';
import './DataTableWrapper.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDatatableData } from '../features/redux-store/dataTableSlice';
import { toast } from 'react-toastify';

const DataTable = () => {
  const dispatch = useDispatch();
  const { crudData, loading, error } = useSelector((state) => state.dataTable);

  const intervalRef = useRef(null);
  const failureRef = useRef(0);
  const lastToastTimeRef = useRef(null);
  const runningRef = useRef(false);

  const fetchAndRetry = async () => {
    if (runningRef.current) return; // prevent overlap
    runningRef.current = true;

    try {
      const result = await dispatch(fetchDatatableData()).unwrap();

      const now = Date.now();
      const toastCooldown = 10 * 60 * 1000;

      // Show toast only first time or after 10 min gap
      if (
        !lastToastTimeRef.current ||
        now - lastToastTimeRef.current > toastCooldown
      ) {
        toast.success('✅ Sensor data received successfully.', {
          toastId: 'sensor-success',
        });
        lastToastTimeRef.current = now;
      }

      failureRef.current = 0;
      scheduleNext(1000); // regular polling
    } catch (err) {
      failureRef.current += 1;
      const wait = failureRef.current === 1 ? 5000 : 10000;
      toast.error('⚠️ Sensor data fetch failed', { toastId: 'sensor-error' });
      scheduleNext(wait); // retry with backoff
    } finally {
      runningRef.current = false;
    }
  };

  const scheduleNext = (delay) => {
    clearTimeout(intervalRef.current);
    intervalRef.current = setTimeout(fetchAndRetry, delay);
  };

  useEffect(() => {
    fetchAndRetry();
    return () => clearTimeout(intervalRef.current);
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
      {loading && !crudData.length && (
        <div className="loading">📡 Loading sensor data...</div>
      )}
      {error && !crudData.length && (
        <div className="loading">❌ Error loading sensor data</div>
      )}
      {crudData.length > 0 && (
        <section className="content-area datatable-wrapper">
          {renderBoards(crudData[0])}
        </section>
      )}
    </>
  );
};

export default DataTable;
