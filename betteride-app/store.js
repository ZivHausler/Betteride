import { configureStore } from "@reduxjs/toolkit";
import navReducer from './slices/navSlice';
import userReducer from './slices/userSlice'
import vehicleReducer from './slices/vehicleSlice';

export const store = configureStore({
    reducer: {
        nav: navReducer,
        user: userReducer,
        vehicle: vehicleReducer,
    },
})