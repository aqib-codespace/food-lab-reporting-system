import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReportData } from "@/types/report";

export interface SavedReport extends ReportData {
  id: string;
  createdAt: string;
}

interface ReportsState {
  reports: SavedReport[];
}

const initialState: ReportsState = {
  reports: [],
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    addReport: (state, action: PayloadAction<SavedReport>) => {
      state.reports.unshift(action.payload);
    },
    deleteReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter(
        (report) => report.id !== action.payload
      );
    },
    updateReport: (state, action: PayloadAction<SavedReport>) => {
      const index = state.reports.findIndex(
        (report) => report.id === action.payload.id
      );
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    },
    setReports: (state, action: PayloadAction<SavedReport[]>) => {
      state.reports = action.payload;
    },
  },
});

export const { addReport, deleteReport, updateReport, setReports } =
  reportsSlice.actions;
export default reportsSlice.reducer;
