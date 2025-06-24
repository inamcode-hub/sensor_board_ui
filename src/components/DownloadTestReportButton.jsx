import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';

const boardMap = {
  1: { moisture: 'ai1', temp: 'ai2', serial: 'N2521102' },
  2: { moisture: 'ai3', temp: 'ai4', serial: 'N2521103' },
  3: { moisture: 'ai5', temp: 'ai6', serial: 'N2521104' },
  4: { moisture: 'ai7', temp: 'ai8', serial: 'N2521105' },
  5: { moisture: 'ai9', temp: 'ai10', serial: 'N2521106' },
  6: { moisture: 'ai11', temp: 'ai12', serial: 'N2521107' },
  7: { moisture: 'ai13', temp: 'ai14', serial: 'N2521108' },
  8: { moisture: 'ai15', temp: 'ai16', serial: 'N2521109' },
  9: { moisture: 'ai17', temp: 'ai18', serial: 'N2521110' },
  10: { moisture: 'ai19', temp: 'ai20', serial: 'N2521111' },
  11: { moisture: 'ai21', temp: 'ai22', serial: 'N2521112' },
  12: { moisture: 'ai23', temp: 'ai24', serial: 'N2521113' },
};

const formatExcelDate = (dateStr) => {
  const date = new Date(dateStr);
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const yy = String(date.getFullYear()).slice(-2);
  const hh = date.getHours();
  const h = hh % 12 || 12;
  const ampm = hh >= 12 ? 'PM' : 'AM';
  const min = date.getMinutes().toString().padStart(2, '0');
  return `${mm}/${dd}/${yy} ${h}:${min} ${ampm}`;
};

const isStableMoisture = (entries, threshold = 0.02) => {
  for (let i = 1; i < entries.length; i++) {
    const dt =
      new Date(entries[i].timestamp) - new Date(entries[i - 1].timestamp);
    const dMoisture = Math.abs(entries[i].m - entries[i - 1].m);
    if (dt <= 1000 && dMoisture > threshold) {
      return false;
    }
  }
  return true;
};

const DownloadTestReportButton = () => {
  const { data } = useSelector((state) => state.chart);

  const generateReport = () => {
    if (!data || data.length === 0) {
      console.warn('No chart data available!');
      return;
    }

    const report = [];

    Object.entries(boardMap).forEach(
      ([boardNum, { moisture, temp, serial }]) => {
        const filtered = data
          .map((row) => ({
            timestamp: row.timestamp,
            m: parseFloat(row[moisture]),
            t: parseFloat(row[temp]),
          }))
          .filter((d) => !isNaN(d.m) && !isNaN(d.t));

        if (filtered.length === 0) {
          console.warn(`⚠️ No valid data for Board ${boardNum} (${serial})`);
          return;
        }

        const mVals = filtered.map((d) => d.m);
        const tVals = filtered.map((d) => d.t);

        const mMax = Math.max(...mVals);
        const mMin = Math.min(...mVals);
        const tMax = Math.max(...tVals);
        const tMin = Math.min(...tVals);
        const mDiff = mMax - mMin;
        const tDiff = tMax - tMin;

        // MV formula based on original Excel logic
        const mv = tDiff !== 0 ? (mDiff / (tDiff / 0.025)).toFixed(3) : '';

        const pass =
          isStableMoisture(filtered) && Math.abs(mv) <= 1 ? 'P' : 'F';

        report.push([
          boardNum,
          serial,
          formatExcelDate(filtered[0].timestamp),
          formatExcelDate(filtered[filtered.length - 1].timestamp),
          mMax.toFixed(3),
          mMin.toFixed(3),
          mDiff.toFixed(3),
          tMax.toFixed(3),
          tMin.toFixed(3),
          tDiff.toFixed(3),
          mv,
          pass,
        ]);
      }
    );

    const header = [
      'Board #',
      'S#',
      'Start Time',
      'End Time',
      'M_Max',
      'M_Min',
      'M_Diff',
      'T_Max',
      'T_Min',
      'T_Diff',
      'mv',
      'Pass/Fail',
    ];

    const csv = [header, ...report].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `test_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button type="primary" onClick={generateReport}>
      🧪 Download Test Report
    </Button>
  );
};

export default DownloadTestReportButton;
