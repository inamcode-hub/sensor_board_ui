import React, { useEffect, useState } from 'react';
import './DataTableWrapper.css';

const DataTable = () => {
  const [items, setItems] = useState([]);
  const [calitems, setCalitems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getItems = async () => {
    try {
      const [crudRes, calrigRes] = await Promise.all([
        fetch('http://192.168.1.83:9000/crud'),
        fetch('http://192.168.1.83:9000/calrig'),
      ]);

      if (!crudRes.ok || !calrigRes.ok) {
        throw new Error('Failed to fetch one or more endpoints.');
      }

      const [itemsData, calitemsData] = await Promise.all([
        crudRes.json(),
        calrigRes.json(),
      ]);

      setItems(itemsData);
      setCalitems(calitemsData);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to load sensor data. Please check connection.');
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
    const boards = [];
    for (let i = 1; i <= 12; i++) {
      const aiM = `ai${(i - 1) * 2 + 1}`;
      const aiT = `ai${(i - 1) * 2 + 2}`;
      const mRaw = item[aiM];
      const tRaw = item[aiT];

      const mVal =
        mRaw && !isNaN(parseFloat(mRaw)) ? parseFloat(mRaw).toFixed(3) : '-';
      const tVal =
        tRaw && !isNaN(parseFloat(tRaw)) ? parseFloat(tRaw).toFixed(3) : '-';

      boards.push(
        <div key={i} className={`board board${i}`}>
          <div className="board-label">BOARD {i}</div>
          <div className="m-label">M</div>
          <div className="t-label">T</div>
          <div className="m-value">{mVal}</div>
          <div className="t-value">{tVal}</div>
        </div>
      );
    }
    return boards;
  };

  if (loading) return <div className="loading">Loading sensor data...</div>;
  if (error) return <div className="loading">{error}</div>;
  if (!items.length)
    return <div className="loading">No sensor data available.</div>;

  return (
    <section className="content-area datatable-wrapper">
      {renderBoards(items[0])}
    </section>
  );
};

export default DataTable;
