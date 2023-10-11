import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwt_decode from "jwt-decode";

const SERVER_URL = "http://localhost:8000/api/token/";

type AuthState = {
  authTokens: any | null;
  user: any | null;
  loading: boolean;
  loginStatus: number | null;
};

const initialState: AuthState = {
  authTokens: localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens")!)
    : null,
  user: localStorage.getItem("authTokens")
    ? jwt_decode(localStorage.getItem("authTokens")!)
    : null,
  loading: true,
  loginStatus: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(SERVER_URL, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        return thunkAPI.rejectWithValue("Login failed");
      }

      return {
        ...response.data,
        status: response.status,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue({
          message: error.message,
          status: error.response?.status,
        });
      }
      return thunkAPI.rejectWithValue("Login failed");
    }
  }
);

export const logoutUser = () => {
  return (dispatch: any) => {
    dispatch(clearAuth());
    window.location.reload();
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens: (state, action: PayloadAction<any>) => {
      state.authTokens = action.payload;
      state.user = jwt_decode(action.payload.access);
      localStorage.setItem("authTokens", JSON.stringify(action.payload));
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.authTokens = null;
      state.user = null;
      localStorage.removeItem("authTokens");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoginStatus: (state, action: PayloadAction<number | null>) => {
      state.loginStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        const { status, ...tokens } = action.payload;
        console.log(tokens);
        console.log(status);
        state.authTokens = tokens;
        state.user = jwt_decode(tokens.access);
        state.loginStatus = status;
        localStorage.setItem("authTokens", JSON.stringify(tokens));
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log(action.payload);
        const { message, status } = action.payload as { message: string, status: number };
        console.error(message);
        console.log(status);
        state.loginStatus = status;
        // Handle the error in state if neccessary
      });
  },
});

export const { setAuthTokens, setUser, clearAuth, setLoading, setLoginStatus } =
  authSlice.actions;
export default authSlice.reducer;
