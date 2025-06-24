import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const fetchChartData = createAsyncThunk(
  'chart/fetchChartData',
  async ({ start, end, interval }, thunkAPI) => {
    try {
      let url = '';

      if (interval === 'raw') {
        url = `${API_BASE}/sensor`;
      } else {
        const intervalMap = {
          '1s': 'second',
          '1m': 'minute',
          '1h': 'hour',
        };

        const body = JSON.stringify({
          start,
          end,
          inputInterval: intervalMap[interval] || interval,
        });

        const res = await fetch(`${API_BASE}/aligned-query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });

        if (!res.ok) {
          throw new Error(`API ${interval} failed`);
        }

        const result = await res.json();
        return result;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Raw sensor data fetch failed');
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || 'Chart fetch error');
    }
  }
);

const chartSlice = createSlice({
  name: 'chart',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearChartData(state) {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
        state.error = null;
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
        toast.error(`📉 Chart error: ${state.error}`);
      });
  },
});

export const { clearChartData } = chartSlice.actions;
export default chartSlice.reducer;
