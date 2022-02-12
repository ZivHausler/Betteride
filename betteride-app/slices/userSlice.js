import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: null,
    userLocation: null
};

// ----- Setters: (Set) ----- //
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, action) => void (state.userInfo = action.payload),
        setUserLocation: (state,action) => void (state.userLocation = action.payload),
    },
});

export const { setUserInfo } = userSlice.actions;
export const { setUserLocation } = userSlice.actions;

// ----- Selectors: (Get) ----- //
export const selectUserInfo = (state) => state.user.userInfo;
export const selectUserLocation = (state) => state.user.userLocation;

export default userSlice.reducer;

