import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { registerUser } from "../utils/axiosInstance";
import { RegisterStatus } from "../types";

const SERVER_URL = "http://localhost:8000/api/token/";

type AuthState = {
  authTokens: any | null;
  user: any | null;
  loginStatus: number | null;
  registerStatus: RegisterStatus;
};

const initialState: AuthState = {
  authTokens: localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens")!)
    : null,
  user: localStorage.getItem("authTokens")
    ? jwt_decode(localStorage.getItem("authTokens")!)
    : null,
  loginStatus: null,
  registerStatus: {},
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
    localStorage.removeItem("authTokens");
    localStorage.removeItem("lastOpenedTabs");
    localStorage.removeItem("lastOpenedTabIndex");
    dispatch(clearAuth());
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
          user: response.user,
          welcome: response.welcome,
        };
      } else {
        return thunkAPI.rejectWithValue(
          "Registration but failed to retrieve tokens."
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue({
          data: error.response.data,
          status: error.status,
        });
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
    },
    setLoginStatus: (state, action: PayloadAction<number | null>) => {
      state.loginStatus = action.payload;
    },
    setRegisterStatus: (state, action: PayloadAction<RegisterStatus>) => {
      state.registerStatus = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // logging in
      .addCase(loginUser.fulfilled, (state, action) => {
        const { status, ...tokens } = action.payload;
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
        state.registerStatus = null;
        const tokens = action.payload.tokens;
        state.authTokens = tokens;
        state.user = jwt_decode(tokens.access);
        localStorage.setItem("authTokens", JSON.stringify(tokens));
      })
      .addCase(register.rejected, (state, action) => {
        // handle the registration error
        // console.error(action.error.message);
        console.log(action.payload);
        const error = action.payload as { data: any, status: number | undefined };
        // state.registerStatus = error.data
        console.log(error.data);
        state.registerStatus = {
          username: error.data.username,
          email: error.data.email,
          password: error.data.password,
        }
        // you can set some state variable to store the error or handle in some other way
      });
  },
});

export const { setAuthTokens, setUser, clearAuth, setLoginStatus, setRegisterStatus } =
  authSlice.actions;
export default authSlice.reducer;
