import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: false,
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    userEdit: (state, action) => {
      state.user = action.payload
    },
    loginFail: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    }
  }
})


export const { loginSuccess, userEdit, loginFail } = loginSlice.actions;
export default loginSlice.reducer;