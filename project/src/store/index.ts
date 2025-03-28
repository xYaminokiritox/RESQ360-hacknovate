import { configureStore } from '@reduxjs/toolkit';
import emergencyReducer from './slices/emergencySlice';

export const store = configureStore({
  reducer: {
    emergency: emergencyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 