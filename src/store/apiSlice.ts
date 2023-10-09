import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { File, SaveStates } from "../types/FileTypes";
import axios, { isAxiosError } from "axios";

const SERVER_URL = "http://localhost:8000/api/files/";

export interface ApiState {
  saveState: SaveStates;
}

const initialState: ApiState = {
  saveState: "saved",
};

export const saveFileContent = createAsyncThunk(
  "api/saveFileContent",
  async (file: File, { rejectWithValue }) => {
    let authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null;

    try {
      const response = await axios.put(
        `${SERVER_URL}${file.id}/`,
        {
          content: file.content,
          id: file.id,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }

      return rejectWithValue("Failed to save.");
    }
  }
);

export const createFile = createAsyncThunk(
  "api/createFile",
  async (file: File, { rejectWithValue }) => {
    let authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null;

    try {
      const response = await axios.post(SERVER_URL, file, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }

      return rejectWithValue("Failed to create.");
    }
  }
);

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    setSaveState: (state, action: PayloadAction<SaveStates>) => {
      state.saveState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveFileContent.pending, (state) => {
        state.saveState = "saving";
      })
      .addCase(saveFileContent.fulfilled, (state, action) => {
        state.saveState = "saved";
        console.log("accepted change.");
        // Note: Here you may not want to handle file data, since that might still be handled by appSlice.
      })
      .addCase(saveFileContent.rejected, (state, action) => {
        state.saveState = "error";
        console.error(action.error.message);
      });
  },
});

export const { setSaveState } = apiSlice.actions;

export default apiSlice.reducer;
