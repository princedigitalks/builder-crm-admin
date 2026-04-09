import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';

export interface Site {
  _id: string;
  name: string;
  whatsappNumber: string;
  whatsappStatus: string;
  chatbotStatus: string;
  isDeleted: boolean;
  deleteRequested: boolean;
  builderId: {
    _id: string;
    companyName: string;
  };
}

interface WhatsappSiteState {
  sites: Site[];
  loading: boolean;
  error: string | null;
}

const initialState: WhatsappSiteState = {
  sites: [],
  loading: false,
  error: null,
};

export const fetchAdminSites = createAsyncThunk(
  'whatsappSite/fetchAdminSites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/site/admin/all');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sites');
    }
  }
);

export const updateSiteStatus = createAsyncThunk(
  'whatsappSite/updateSiteStatus',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/site/${id}/status`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update site status');
    }
  }
);

const whatsappSiteSlice = createSlice({
  name: 'whatsappSite',
  initialState,
  reducers: {
    syncSiteUpdate: (state, action: PayloadAction<{ action: 'add' | 'update'; site: Site }>) => {
      if (action.payload.action === 'add') {
        state.sites.unshift(action.payload.site);
      } else {
        const index = state.sites.findIndex((s) => s._id === action.payload.site._id);
        if (index !== -1) {
          state.sites[index] = action.payload.site;
        }
      }
    },
    syncStatusUpdate: (state, action: PayloadAction<{ siteId: string; whatsappStatus: string; chatbotStatus: string }>) => {
      const site = state.sites.find((s) => s._id === action.payload.siteId);
      if (site) {
        site.whatsappStatus = action.payload.whatsappStatus;
        site.chatbotStatus = action.payload.chatbotStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminSites.fulfilled, (state, action) => {
        state.loading = false;
        state.sites = action.payload;
      })
      .addCase(fetchAdminSites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSiteStatus.fulfilled, (state, action) => {
        const index = state.sites.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.sites[index] = action.payload;
        }
      });
  },
});

export const { syncSiteUpdate, syncStatusUpdate } = whatsappSiteSlice.actions;
export default whatsappSiteSlice.reducer;
