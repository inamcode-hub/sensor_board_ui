// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import chartReducer from './chartSlice';
import dataTableReducer from './dataTableSlice';

const store = configureStore({
  reducer: {
    chart: chartReducer,
    dataTable: dataTableReducer,
  },
});

export default store;
