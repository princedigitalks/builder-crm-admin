import { configureStore } from '@reduxjs/toolkit';
import planReducer from '@/redux/slices/planSlice';
import authReducer from '@/redux/slices/authSlice';
import builderReducer from '@/redux/slices/builderSlice';

export const store = configureStore({
  reducer: {
    plan: planReducer,
    auth: authReducer,
    builder: builderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
