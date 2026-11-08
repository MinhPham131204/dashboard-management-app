import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllDashboards, getDashboardDetail, createDashboardApi } from '../mockResponse';
import Dashboard from '../model/Dashboard';

type DashboardState = {
  dashboards: Dashboard[];
  detail: Dashboard | undefined;
  loading: boolean;
  error: string | undefined;
};

const initialState: DashboardState = {
  dashboards: [],
  detail: undefined,
  loading: false,
  error: undefined,
};

export const fetchDashboards = createAsyncThunk(
  "dashboard/fetchAll",
  async () => {
    try {
      const response = await getAllDashboards();
      return response.body.data.iframeList;
    }
    catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error");
    }
  }
);

export const fetchDashboardDetail = createAsyncThunk(
  "dashboard/fetchDetail",
  async (id: number) => {
    try {
      const response = await getDashboardDetail(id);
      return response.body.data.iframe;
    }
    catch (err) {
      throw err;
    }
  }
);

export const createDashboard = createAsyncThunk(
  "dashboard/create",
  async (data: any) => {
    try {
      const response = await createDashboardApi(data);
      return {
        status: response.statusCode,
        message: response.body.message,
      };
    }
    catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboards.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchDashboards.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboards = action.payload;
      })
      .addCase(fetchDashboards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchDashboardDetail.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchDashboardDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchDashboardDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
