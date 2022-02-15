import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    vehicleLocation: null,
    vehiclePlateNumber: null,
};

// ----- Setters: (Set) ----- //
export const vehicleSlice = createSlice({
    name: "vehicle",
    initialState,
    reducers: {
        setVehicleLocation: (state, action) => void (state.vehicleLocation = action.payload),
        setVehiclePlateNumber: (state, action) => void (state.vehiclePlateNumber = action.payload),
    },
});

export const { setVehicleLocation, setVehiclePlateNumber } = vehicleSlice.actions;

// ----- Selectors: (Get) ----- //
export const selectVehicleLocation = (state) => state.user.vehicleLocation;
export const selectVehiclePlateNumber = (state) => state.user.vehiclePlateNumber;

export default vehicleSlice.reducer;

