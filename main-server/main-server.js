// import { GOOGLE_MAPS_APIKEY } from '@env';
const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const app = express();
const cors = require("cors");
const axios = require("axios");
const { response } = require("express");
const { dir } = require("console");
const googleMapsKey = "AIzaSyB9mAs9XA7wtN9RdKMKRig7wlHBfUtjt1g";
const distance = require("google-distance-matrix");
const munkres = require("munkres-js");

app.use(cors({ origin: true }));

app.listen(3001, async () => {
  console.log("Waiting for a request...");
});

app.get("/api/OrderVehicle", async (req, res) => {
  const { userOrigin, userDestination, userID } = req.query;
  // find the nearest vehicle and assign it to the user
  const vehiclePlateNumber = await naiveAssignmentVehicleToUser(userOrigin, userDestination, userID)
  if (vehiclePlateNumber === -1) {
    console.log("exited with status 404")
    res.status(404).send('nothing works here');
  }
  else {
    // collect all vehicles which currently on the way to users
    // and create a costMatrix out of it
    await createCostMatrix();
    res.status(200).send(JSON.stringify(vehiclePlateNumber));
  }
});

// methods
const createCostMatrix = async () => {
  const response = await fetch(`http://localhost:3000/getVehiclesTowardsUsers`);
  const responseData = await response.json();
  if (responseData.length <= 0) return;
  const origins = [];
  const destinations = [];
  const vehiclesIDs = [];
  const usersIDs = [];
  distance.key('AIzaSyAYOZJcrH22i5ePgb4ctAUPsQw9oU69MwU');

  let count = 0;
  let mishtatfimMatrix = [];
  responseData.forEach((vehicle) => {
    origins.push(vehicle.currentLocation.location.lat + "," + vehicle.currentLocation.location.lng);
    destinations.push(vehicle.routeToUser.end_location.lat + "," + vehicle.routeToUser.end_location.lng);
    vehiclesIDs.push(vehicle.plateNumber);
    usersIDs.push(count++);
  });
  if (usersIDs.length <= 1) {
    console.log("not enough vehicles to optimize")
    return;
  }

  distance.matrix(origins, destinations, (err, distances) => {
    const distanceMatrix = initiateMatrix(vehiclesIDs.length, usersIDs.length);
    if (err) {
      return console.log(err);
    }
    if (!distances) {
      return console.log("no distances");
    }
    if (distances.status == "OK") {
      mishtatfimMatrix = initiateMatrix(
        vehiclesIDs.length,
        usersIDs.length
      );
      for (let i = 0; i < origins.length; i++) {
        for (let j = 0; j < destinations.length; j++) {
          if (distances.rows[0].elements[j].status == "OK") {
            distanceMatrix[i][j] = (distances.rows[i].elements[j].duration.value / 60).toFixed(2);
            mishtatfimMatrix[i][j] = 'vehicle plate number: ' + vehiclesIDs[i] + " to location: " + destinations[j] + " will last: " + (distances.rows[i].elements[j].duration.value / 60).toFixed(2) + ' minutes';
          }
          else console.log(destination + " is not reachable from " + origin);
        }
      }
    }
    optimizedAssignedVehicles(distanceMatrix, vehiclesIDs, usersIDs, destinations, mishtatfimMatrix);
    // return distanceMatrix;
  });
};
const optimizedAssignedVehicles = async (distanceMatrix, vehicleIDs, usersIDs, destinations, mishtatfimMatrix) => {
  let unoptimizedTotalDrivingTimeToUser = (await getTotalDrivingTimeToUser() / 60);
  unoptimizedTotalDrivingTimeToUser = unoptimizedTotalDrivingTimeToUser.toFixed(2);
  console.log("\nTotal driving time before optimization is: " + unoptimizedTotalDrivingTimeToUser + ' minutes,');
  console.log('when the current distribution looks like:');

  mishtatfimMatrix.forEach((mishtatef, index) => console.log(mishtatef[index]));
  console.log('');
  console.log('Full distance matrix (by minutes): ', distanceMatrix);
  // get the optimized routes by the Hungarian Algorithm
  const optimizedRoutes = munkres(distanceMatrix);
  console.log("In order to optimize the routes, consider the following distribution: ", optimizedRoutes);
  console.log('');
  // calculate total optimize time:
  let optimizedTotalDrivingTimeToUser = 0;
  optimizedRoutes.forEach(route => optimizedTotalDrivingTimeToUser += parseInt(distanceMatrix[route[0]][route[1]]));
  console.log("Total driving time after optimization is: " + optimizedTotalDrivingTimeToUser + ' minutes,')
  console.log('when the new distribution will be:');
  mishtatfimMatrix.forEach((mishtatef, index) => console.log(mishtatef[optimizedRoutes[index][1]]));

  optimizedRoutes.forEach(route => {
    route[0] = vehicleIDs[route[0]];
    route[1] = destinations[route[1]];
  })

  if (await getTotalDrivingTimeToUser() > optimizedTotalDrivingTimeToUser) {
    await fetch("http://localhost:3000/reassignVehiclesToUsers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(optimizedRoutes),
    })
  }
};

const initiateMatrix = (vehiclesLength, usersLength) => {
  return Array.from(
    {
      // generate array of length m
      length: usersLength,
      // inside map function generate array of size n
      // and fill it with `0`
    },
    () => new Array(vehiclesLength).fill(null)
  );
};
const getDirectionsByAddress = async (from, to) => {
  return await axios
    .get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&key=${googleMapsKey}`
    )
    .then((response) => response.data)
    .catch((error) => console.log("error"));
};
const sortedVehicleArray = (nearestVehicles) => {
  // Create items array
  let sortedArray = Object.keys(nearestVehicles).map(function (key) {
    return [key, nearestVehicles[key]];
  });

  // Sort the array based on the second element
  sortedArray.sort(function (first, second) {
    return first[0] - second[0];
  });
  return sortedArray;
};
const replaceDistWithETA = async (dict, callLocation) => {
  let newDict = {};
  for (const [key, value] of Object.entries(dict)) {
    const response = await fetch(
      `http://localhost:3000/api/getRoute?fromLat=${value.currentLocation.location.lat}&fromLng=${value.currentLocation.location.lng}&toLat=${callLocation.lat}&toLng=${callLocation.lng}`
    );
    const responseData = await response.json();
    console.log(responseData)
    newDict[responseData.routes[0].legs[0].duration.value / 60] = {
      vehicle: value,
      routeToUser: responseData,
    };
  }
  return newDict;
};
const isFitToCompleteTheTrip = (vehicle, endpoint) => {
  // calculate the km the car has left, then check if the endpoint meets the requirements
  return true;
};
const calculateUnavailableCars = async (
  vehicles,
  nearestVehicles,
  callLocation
) => {
  for (const [key, value] of Object.entries(vehicles)) {
    if (value.currentTrip != null) {
      let response = await fetch(
        `http://localhost:3000/api/getRoute?fromLat=${value.currentTrip.end_location.lat}&fromLng=${value.currentTrip.end_location.lng}&toLat=${callLocation.lat}&toLng=${callLocation.lng}`
      )
        .then((response) => response.json())
        .then((response) => response);
      let ETAToDestination =
        response.routes[0].legs[0].duration.value / 60 +
        value.currentTrip.etaMin;
      nearestVehicles = replaceMaxKey(nearestVehicles, value, ETAToDestination);
    }
  }
  return nearestVehicles;
};
const replaceMaxKey = (dict, value, newKey) => {
  let max = Math.max(...Object.keys(dict));
  // if we have found a lower dist from, replace
  if (newKey < max) {
    delete dict[max];
    dict[newKey] = value;
  }
  return dict;
};
// This method is responsible for assigning user to the nearest (by time) vehicle
// @param userOrigin
// @param userDestination
// the method recives user origin and destination, calc its route and returns the assigned vehicle
const naiveAssignmentVehicleToUser = async (userOrigin, userDestination, userID) => {
  const userRoute = await getDirectionsByAddress(userOrigin, userDestination);
  const userOriginCoordinates = userRoute.routes[0].legs[0].start_location;
  const vehiclesResponse = await fetch(`http://localhost:3000/getVehicles`);
  const vehicles = await vehiclesResponse.json();
  let nearestVehicles = {};

  // loop through all vehicles and output n nearest vehicles
  for (const [key, value] of Object.entries(vehicles)) {
    let dist = Math.sqrt(Math.pow(userOriginCoordinates.lat - value.currentLocation.location.lat, 2) + Math.pow(userOriginCoordinates.lng - value.currentLocation.location.lng, 2));
    if (Object.keys(nearestVehicles).length < 3) {
      // the vehicle is available
      if (!value?.routeToUser && !value?.routeWithUser) {
        nearestVehicles[dist] = value;
      }
    } else nearestVehicles = replaceMaxKey(nearestVehicles, value, dist);
  }
  if (Object.keys(nearestVehicles).length <= 0) {
    console.log("there are no available cars for the ride");
    return -1;
  }
  // replace distance with estimated arrival time
  nearestVehicles = await replaceDistWithETA(
    nearestVehicles,
    userOriginCoordinates
  );
  // the row commented below, checks if there is a better vehicle, which its ride ends near the user origin.
  // nearestVehicles = await calculateUnavailableCars(vehicles, nearestVehicles, userOriginCoordinates);

  // sort the vehicles and return array from min to max
  const sortedNearestVehicles = sortedVehicleArray(nearestVehicles);
  // push route into the avialable vehicle

  // if (!sortedNearestVehicles[0][1]){
  //   console.log()
  // }

  // add to the desired vehicle the route to user destination from user origin
  sortedNearestVehicles[0][1].routeToUser.routes[0].legs[0]['trip_type'] = 'to_user';
  sortedNearestVehicles[0][1].routeToUser.routes[0].legs[0]['user_id'] = userID;
  await fetch("http://localhost:3000/pushRouteToVehicle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vehicle: sortedNearestVehicles[0][1].vehicle, routeToUser: sortedNearestVehicles[0][1].routeToUser })
  });
  await fetch("http://localhost:3000/pushTripLocationsToUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID, userOrigin, userDestination, vehiclePlateNumber: sortedNearestVehicles[0][1].vehicle.plateNumber })
  });
  return sortedNearestVehicles[0][1].vehicle.plateNumber;
};
const getTotalDrivingTimeToUser = async () => {
  let response = await fetch(`http://localhost:3000/getTotalDrivingTimeToUser`)
  return await response.json();
} 