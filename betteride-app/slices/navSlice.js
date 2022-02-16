import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLocation: { lat: 32.097326, lng: 34.797007 },
  origin: null,
  destination: null,
  travelTimeInformation: null,
  tabShown: 'order',
  routeShown: 'userToDestination',
  userAssignedVehicle: null,
  clearGoogleInputs: null
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => void (state.currentLocation = action.payload),
    setOrigin: (state, action) => void (state.origin = action.payload),
    setDestination: (state, action) => void (state.destination = action.payload),
    setTravelTimeInformation: (state, action) =>
      void (state.travelTimeInformation = action.payload),
    setTabShown: (state, action) => void (state.tabShown = action.payload),
    setRouteShown: (state, action) => void (state.routeShown = action.payload),
    setUserAssignedVehicle: (state, action) => void (state.userAssignedVehicle = action.payload),
    setClearGoogleInputs: (state,action) => void (state.clearGoogleInputs = action.payload),
  },
});

export const { currentLocation, setOrigin, setDestination, setTravelTimeInformation, setTabShown, setRouteShown, setUserAssignedVehicle, setClearGoogleInputs } = navSlice.actions;

// ----- Selectors: ----- //
export const selectCurrentLocation = (state) => state.nav.currentLocation;
export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectTravelTimeInformation = (state) =>
  state.nav.travelTimeInformation;
export const selectTabShown = (state) => state.nav.tabShown;
export const selectRouteShown = (state) => state.nav.routeShown;
export const selectUserAssignedVehicle = (state) => state.nav.userAssignedVehicle;
export const selectClearGoogleInputs = (state) => state.nav.clearGoogleInputs;

export default navSlice.reducer;

