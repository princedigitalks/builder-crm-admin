import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';

export interface Plan {
  _id?: string;
  planName: string;
  price: number;
  duration: 'Monthly' | 'Quarterly' | 'Bi-Annually' | 'Annually';
  noOfStaff: number;
  noOfSites: number;
  noOfWhatsapp: number;
  status: 'active' | 'inactive';
}

export interface PlanState {
  plans: Plan[];
  loading: boolean;
  error: string | null;
}

const initialState: PlanState = {
  plans: [],
  loading: false,
  error: null,
};

export const fetchPlans = createAsyncThunk('plan/fetchPlans', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/plan');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Something went wrong');
  }
});

export const createPlan = createAsyncThunk('plan/createPlan', async (planData: Plan, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/plan', planData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create plan');
  }
});

export const updatePlan = createAsyncThunk('plan/updatePlan', async ({ id, data }: { id: string, data: Partial<Plan> }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/plan/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update plan');
  }
});

export const deletePlan = createAsyncThunk('plan/deletePlan', async (id: string, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/plan/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete plan');
  }
});

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Plan
      .addCase(createPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPlan.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.loading = false;
        state.plans.unshift(action.payload); // Add to top
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Plan
      .addCase(updatePlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePlan.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.loading = false;
        const index = state.plans.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Plan
      .addCase(deletePlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePlan.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.plans = state.plans.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default planSlice.reducer;
