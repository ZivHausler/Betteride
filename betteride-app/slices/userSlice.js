import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: null,
};

// ----- Setters: (Set) ----- //
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action) => void (state.userInfo = action.payload),
    },
});

export const { setUserInfo } = userSlice.actions;

// ----- Selectors: (Get) ----- //
export const selectUserInfo = (state) => state.user.userInfo;

export default userSlice.reducer;

