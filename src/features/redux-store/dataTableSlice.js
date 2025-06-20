import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

let lastToastType = null; // 'success' | 'error' | null
let lastSuccessTime = null;

export const fetchDatatableData = createAsyncThunk(
  'datatable/fetchData',
  async (_, thunkAPI) => {
    try {
      const [crudRes, calrigRes] = await Promise.all([
        fetch(`${API_BASE}/crud`),
        fetch(`${API_BASE}/calrig`),
      ]);

      if (!crudRes.ok || !calrigRes.ok) {
        throw new Error('One or more endpoints failed');
      }

      const [crudData, calrigData] = await Promise.all([
        crudRes.json(),
        calrigRes.json(),
      ]);

      return { crud: crudData, calrig: calrigData };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || 'Fetch failed');
    }
  }
);

const dataTableSlice = createSlice({
  name: 'datatable',
  initialState: {
    crudData: [],
    calrigData: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearDatatableData(state) {
      state.crudData = [];
      state.calrigData = [];
      state.lastFetched = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatatableData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDatatableData.fulfilled, (state, action) => {
        state.loading = false;
        state.crudData = action.payload.crud;
        state.calrigData = action.payload.calrig;
        state.lastFetched = new Date().toISOString();
        state.error = null;

        const now = Date.now();
        const shouldShowSuccessToast =
          lastToastType !== 'success' ||
          !lastSuccessTime ||
          now - lastSuccessTime > 10 * 60 * 1000;

        if (shouldShowSuccessToast) {
          toast.dismiss('datatable-toast');
          toast.success('✅ Sensor data received successfully.', {
            toastId: 'datatable-toast',
          });
          lastToastType = 'success';
          lastSuccessTime = now;
        }
      })
      .addCase(fetchDatatableData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch';

        const now = Date.now();
        if (lastToastType !== 'error') {
          toast.dismiss('datatable-toast');
          toast.error(`❌ ${state.error}`, {
            toastId: 'datatable-toast',
          });
          lastToastType = 'error';
        }
      });
  },
});

export const { clearDatatableData } = dataTableSlice.actions;
export default dataTableSlice.reducer;
