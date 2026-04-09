import { configureStore } from '@reduxjs/toolkit';
import planReducer from '@/redux/slices/planSlice';
import authReducer from '@/redux/slices/authSlice';
import builderReducer from '@/redux/slices/builderSlice';
import notificationReducer from '@/redux/slices/notificationSlice';
import whatsappSiteReducer from '@/redux/slices/whatsappSiteSlice';

export const store = configureStore({
  reducer: {
    plan: planReducer,
    auth: authReducer,
    builder: builderReducer,
    notification: notificationReducer,
    whatsappSite: whatsappSiteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
