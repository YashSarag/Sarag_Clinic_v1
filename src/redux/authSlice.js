import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("sarag_clinic_user");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem(
        "sarag_clinic_user",
        JSON.stringify(action.payload)
      );
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("sarag_clinic_user");
    },

  },
});

export const {
  loginSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;