import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
}

interface Plan {
  _id: string;
  planName: string;
  price: number;
  duration: string;
  noOfStaff: number;
  noOfSites: number;
  noOfWhatsapp: number;
}

export interface Builder {
  _id: string;
  userId: User;
  planId: Plan;
  companyName: string;
  address: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  amountPaid: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BuilderState {
  builders: Builder[];
  loading: boolean;
  error: string | null;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null;
}

const initialState: BuilderState = {
  builders: [],
  loading: false,
  error: null,
  pagination: null,
};

export const fetchAllBuilders = createAsyncThunk(
  'builder/fetchAllBuilders',
  async ({ page = 1, search = '' }: { page?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/builder/all?page=${page}&search=${search}&limit=10`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch builders');
    }
  }
);

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBuilders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBuilders.fulfilled, (state, action) => {
        state.loading = false;
        state.builders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllBuilders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default builderSlice.reducer;
