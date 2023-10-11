import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { File, SaveStates, NewFile } from "../types/FileTypes";

import axios from "../utils/axiosInstance";
import { isAxiosError } from "axios";

import { selectSelectedFile } from "./appSlice";
import { RootState } from "./store";

const SERVER_URL = "http://localhost:8000/api/files/";

export interface ApiState {
  saveState: SaveStates;
}

const initialState: ApiState = {
  saveState: "saved",
};

export const saveFile = createAsyncThunk(
  "api/saveFile",
  async (file: File, { rejectWithValue, getState }) => {
    let authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null;

    const state = getState() as RootState;
    const selectedFile = selectSelectedFile(state);

    const verified = file.id === selectedFile;
    if (!verified) {
      console.log("file verification failed");
      return;
    }

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
  async (file: NewFile, { rejectWithValue }) => {
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

export const deleteFile = createAsyncThunk(
  "api/deleteFile",
  async (fileId: File["id"], { rejectWithValue }) => {
    let authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null;

    try {
      const response = await axios.delete(`${SERVER_URL}${fileId}/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      // Assuming your backend responds with a success message or data related to the deleted file
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }

      return rejectWithValue("Failed to delete.");
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
      // saving a file
      .addCase(saveFile.pending, (state) => {
        state.saveState = "saving";
      })
      .addCase(saveFile.fulfilled, (state, action) => {
        state.saveState = "saved";
        console.log("accepted change.");
        // Note: Here you may not want to handle file data, since that might still be handled by appSlice.
      })
      .addCase(saveFile.rejected, (state, action) => {
        state.saveState = "error";
        console.error(action.error.message);
      })

      // deleting a file
      .addCase(deleteFile.fulfilled, (state, action) => {
        // Here you can update your state after a file was successfully deleted
        // console.log(action);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        console.error(action.error.message);
      });
  },
});

export const { setSaveState } = apiSlice.actions;

export default apiSlice.reducer;
