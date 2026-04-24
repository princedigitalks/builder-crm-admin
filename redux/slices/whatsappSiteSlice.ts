import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';

export interface WhatsappHub {
  _id: string;
  name: string;
  number: string;
  whatsappStatus: string;
  chatbotStatus: string;
  isDeleted: boolean;
  deleteRequested: boolean;
  builderId: {
    _id: string;
    companyName: string;
  };
}

interface WhatsappHubState {
  hubs: WhatsappHub[];
  loading: boolean;
  error: string | null;
}

const initialState: WhatsappHubState = {
  hubs: [],
  loading: false,
  error: null,
};

export const fetchAdminWhatsappHubs = createAsyncThunk(
  'whatsappHub/fetchAdminWhatsappHubs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/whatsapp/admin/all');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hubs');
    }
  }
);

export const updateWhatsappHubStatus = createAsyncThunk(
  'whatsappHub/updateWhatsappHubStatus',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/whatsapp/admin/${id}/status`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update hub status');
    }
  }
);

const whatsappHubSlice = createSlice({
  name: 'whatsappHub',
  initialState,
  reducers: {
    syncHubUpdate: (state, action: PayloadAction<{ action: 'add' | 'update'; whatsapp: WhatsappHub }>) => {
      if (action.payload.action === 'add') {
        state.hubs.unshift(action.payload.whatsapp);
      } else {
        const index = state.hubs.findIndex((h) => h._id === action.payload.whatsapp._id);
        if (index !== -1) {
          state.hubs[index] = action.payload.whatsapp;
        }
      }
    },
    syncStatusUpdate: (state, action: PayloadAction<{ whatsappId: string; whatsappStatus: string; chatbotStatus: string }>) => {
      const hub = state.hubs.find((h) => h._id === action.payload.whatsappId);
      if (hub) {
        hub.whatsappStatus = action.payload.whatsappStatus;
        hub.chatbotStatus = action.payload.chatbotStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminWhatsappHubs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminWhatsappHubs.fulfilled, (state, action) => {
        state.loading = false;
        state.hubs = action.payload;
      })
      .addCase(fetchAdminWhatsappHubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateWhatsappHubStatus.fulfilled, (state, action) => {
        const index = state.hubs.findIndex((h) => h._id === action.payload._id);
        if (index !== -1) {
          state.hubs[index] = action.payload;
        }
      });
  },
});

export const { syncHubUpdate, syncStatusUpdate } = whatsappHubSlice.actions;
export default whatsappHubSlice.reducer;
