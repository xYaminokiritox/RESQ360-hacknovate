import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { emergencyService } from '../../services/emergencyService';
import { EmergencyNumber } from '../../services/emergencyService';

interface EmergencyState {
  numbers: EmergencyNumber[];
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
}

const initialState: EmergencyState = {
  numbers: [],
  isLoading: false,
  error: null,
  isOnline: navigator.onLine,
};

export const fetchEmergencyNumbers = createAsyncThunk(
  'emergency/fetchNumbers',
  async () => {
    const numbers = await emergencyService.getEmergencyNumbers();
    return numbers;
  }
);

const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmergencyNumbers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmergencyNumbers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.numbers = action.payload;
      })
      .addCase(fetchEmergencyNumbers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch emergency numbers';
      });
  },
});

export const { setOnlineStatus } = emergencySlice.actions;
export default emergencySlice.reducer; 