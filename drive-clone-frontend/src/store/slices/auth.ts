import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import { AuthService } from "../../service/api/auth.service";

interface User {
  // Define your user properties here
  id: number;
  username: string;
  email: string;
  // Add more properties as needed
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

const user =  JSON.parse(localStorage.getItem("user") as string);


export const login = createAsyncThunk<
  { user: User },
  { username: string; password: string }
>("auth/login", async ({ username, password }, thunkAPI) => {
  try {
    const data = await AuthService.login({username, password});
    console.log("data", data);
    return { user: data };
  } catch (error: Error | any) {
    const message =
      (error?.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString();
    console.log("error", message);
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await AuthService.logout();
});

const initialState: AuthState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;