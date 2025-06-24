import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';

const DownloadCSVButton = () => {
  const { data } = useSelector((state) => state.chart);

  const downloadCSV = () => {
    if (!data || data.length === 0) return;

    const aiKeys = Object.keys(data[0])
      .filter((k) => /^ai\d+$/.test(k))
      .sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2)));

    const header = ['id', 'timestamp', ...aiKeys];

    const rows = data.map((row) => {
      const id = row.id ?? '';
      const timestamp = new Date(row.timestamp).toISOString();
      const values = aiKeys.map((k) => parseFloat(row[k]).toFixed(6));
      return [id, timestamp, ...values];
    });

    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `full_sensor_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={downloadCSV}
      type="primary"
      style={{ marginBottom: '1rem', marginLeft: '1rem' }}
    >
      ⬇️ Download Full CSV
    </Button>
  );
};

export default DownloadCSVButton;
