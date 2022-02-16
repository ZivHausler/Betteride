import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    vehicleLocation: null,
    vehiclePlateNumber: null,
    vehicleETA:null,
    vehicleKMLeft:null,
    vehicleTimeLeft:null
};

// ----- Setters: (Set) ----- //
export const vehicleSlice = createSlice({
    name: "vehicle",
    initialState,
    reducers: {
        setVehicleLocation: (state, action) => void (state.vehicleLocation = action.payload),
        setVehiclePlateNumber: (state, action) => void (state.vehiclePlateNumber = action.payload),
        setVehicleETA: (state, action) => void (state.vehicleETA = action.payload),
        setVehicleKMLeft: (state, action) => void (state.vehicleKMLeft = action.payload),
        setVehicleTimeLeft: (state, action) => void (state.vehicleTimeLeft = action.payload),
    },
});

export const { setVehicleLocation, setVehiclePlateNumber,setVehicleTimeLeft,setVehicleKMLeft,setVehicleETA } = vehicleSlice.actions;

// ----- Selectors: (Get) ----- //
export const selectVehicleLocation = (state) => state.vehicle.vehicleLocation;
export const selectVehiclePlateNumber = (state) => state.vehicle.vehiclePlateNumber;
export const selectVehicleETA = (state) => state.vehicle.vehicleETA;
export const selectVehicleKMLeft = (state) => state.vehicle.vehicleKMLeft;
export const selectVehicleTimeLeft = (state) => state.vehicle.vehicleTimeLeft;

export default vehicleSlice.reducer;

