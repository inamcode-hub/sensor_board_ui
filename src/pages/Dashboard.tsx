import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';

type Item = {
  id: string;
  [key: string]: any;
};

const Dashboard = () => {
  const [crudItems, setCrudItems] = useState<Item[]>([]);
  const [calrigItems, setCalrigItems] = useState<Item[]>([]);

  const fetchData = async () => {
    try {
      const [crudRes, calrigRes] = await Promise.all([
        fetch('http://192.168.1.83:9000/crud'),
        fetch('http://192.168.1.83:9000/calrig'),
      ]);
      setCrudItems(await crudRes.json());
      setCalrigItems(await calrigRes.json());
    } catch (err) {
      console.error('API fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id: string) => {
    setCrudItems((prev) => prev.filter((i) => i.id !== id));
    // TODO: send delete request to backend
  };

  const handleEdit = (item: Item) => {
    alert('Edit item: ' + JSON.stringify(item, null, 2));
    // TODO: open modal or form
  };

  return (
    <div>
      <DataTable
        title="📦 CRUD Items"
        data={crudItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Dashboard;
