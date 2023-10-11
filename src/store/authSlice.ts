import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { registerUser } from "../utils/axiosInstance";

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
    // window.location.reload();
  };
};

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      username,
      email,
      password,
    }: { username: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const response = await registerUser(username, email, password);
      // check if we received the tokens in the response
      if (response.access && response.refresh) {
        // store tokens and other necessary info if needed in my state
        return {
          tokens: { access: response.access, refresh: response.refresh },
          user: { ...response },
        };
      } else {
        return thunkAPI.rejectWithValue("Registration but failed to retrieve tokens.")
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("Registration failed");
    }
  }
);

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
      // logging in
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
        const { message, status } = action.payload as {
          message: string;
          status: number;
        };
        console.error(message);
        console.log(status);
        state.loginStatus = status;
        // Handle the error in state if neccessary
      })

      // registering
      .addCase(register.fulfilled, (state, action) => {
        const tokens = action.payload.tokens;
        state.authTokens = tokens;
        state.user = jwt_decode(tokens.access);
      })
      .addCase(register.rejected, (state, action) => {
        // handle the registration error
        console.error(action.error.message);
        // you can set some state variable to store the error or handle in some other way
      });
  },
});

export const { setAuthTokens, setUser, clearAuth, setLoading, setLoginStatus } =
  authSlice.actions;
export default authSlice.reducer;
