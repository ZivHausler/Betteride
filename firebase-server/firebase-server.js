const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./permissions.json");
const jsonParser = bodyParser.json({ limit: '10mb', extended: true });
const googleMapsKey = "AIzaSyB9mAs9XA7wtN9RdKMKRig7wlHBfUtjt1g";
const { Expo } = require('expo-server-sdk')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://betteride-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();

app.use(cors({ origin: true }));

app.listen(3000, async () => {
  console.log("Waiting for a request...");
});

// POST CALLS
app.post("/pushRouteToVehicle", jsonParser, async (req, res) => {
  const { vehicle, routeToUser } = req.body;
  // console.log(vehicle, routeToUser);
  db.ref("vehicles").child(vehicle.plateNumber).child("routeToUser").set(routeToUser.routes[0].legs[0]);
  // db.ref("vehicles").child(req.body.vehicle.plateNumber).child("routeWithUser").set(req.body.routeWithUser.routes[0].legs[0]);
  res.sendStatus(200);
});

app.post("/pushTokenToUser", async (req, res) => {
  const { token, userID, } = req.query;
  db.ref("users").child(userID).child("token").set(token);
  res.sendStatus(200);
});

app.post("/loginUser", jsonParser, async (req, res) => {
  const {user} = req.body;
  db.ref("users").child(user.id).once("value",(snapshot) =>{
    if(snapshot.val()){
      // user exists!
      res.send(JSON.stringify(snapshot.val())).status(200);
    }
    else{
      // new user has been logged!
      userObj = {firstName:user.givenName,lastName:user.familyName,photoUrl:user.photoUrl,email:user.email}
      db.ref("users").child(user.id).set(userObj)
      res.send(JSON.stringify(userObj)).status(200);
    }
  })
});

app.post("/pushTripLocationsToUser", jsonParser, async (req, res) => {
  const { userID, userOrigin, userDestination, vehiclePlateNumber } = req.body;
  db.ref("users").child(userID).child("trip").set({ userOrigin, userDestination, vehiclePlateNumber });
  res.sendStatus(200);
});

// PUT CALLS
app.put("/reassignVehiclesToUsers", jsonParser, async (req, res) => {
  const newAssignments = req.body;
  // console.log(`new vehicles to users' locations:`, newAssignments);
  db.ref("vehicles").once("value", (snapshot) => {
    const vehicles = snapshot.val();
    newAssignments.forEach(assign => {
      console.log(assign[0]);
      // check if the new route is different than the old one
      if (assign[1] != vehicles[assign[0]].routeToUser.end_location.lat + ',' + vehicles[assign[0]].routeToUser.end_location.lng) {
        console.log('new route is different then the old route');

      }
    })
  });
  res.sendStatus(200);
});

// GET CALLS
app.get("/getVehicles", async (req, res) => {
  db.ref("vehicles").once("value", (snapshot) => {
    res.send(snapshot.val());
  });
});
app.get("/getVehiclesTowardsUsers", async (req, res) => {
  let tempVehiclesArray = [];
  db.ref("vehicles").once("value", (snapshot) => {
    for (const [key, value] of Object.entries(snapshot.val())) {
      if (value?.routeToUser)
        tempVehiclesArray.push(value);
    }
    res.send(JSON.stringify(tempVehiclesArray));
  });
});
app.get("/api/getRoute", async (req, res) => {
  let { fromLat, fromLng, toLat, toLng } = req.query;
  // let results = await getDirections({ lat: fromLat, lng: fromLng }, { lat: toLat, lng: toLng });
  // res.status(200).send(results);
  getDirections({ lat: fromLat, lng: fromLng }, { lat: toLat, lng: toLng })
    .then((response) => res.status(200).send(response.data))
    .catch((err) => console.log(err));
});
app.get("/getTotalDrivingTimeToUser", async (req, res) => {
  let sum = 0;
  db.ref("vehicles").once("value", (snapshot) => {
    for (const [key, value] of Object.entries(snapshot.val())) {
      if (value?.routeToUser)
        sum += value.routeToUser.duration.value;
    }
    res.send(JSON.stringify(sum))
  });
});

const getDirections = async (from, to) => {
  return await axios
    .get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${from.lat}%2C${from.lng}&destination=${to.lat}%2C${to.lng}&key=${googleMapsKey}`
    )
    .then((response) => response)
    .catch((error) => console.log("error"));
};
// demo vehicle 
const demoSpeed = 100 // how fast the car will rerender to the map
const vehicleRef = db.ref("vehicles");
const usersRef = db.ref('users');

const addDemoVehicleListener = (vehicle) => {
  vehicleRef.child(vehicle.plateNumber).child('routeToUser').on('value', function (dataSnapshot) {
    vehicleRef.child(vehicle.plateNumber).once("value", snapshot => {
      demoVehicle(snapshot.val())
    })
  });
}
const initDemo = () => {
  vehicleRef.once("value", snapshot => {
    Object.values(snapshot.val()).forEach(vehicle => {
      addDemoVehicleListener(vehicle);
    })
  })
}
initDemo();
const demoVehicle = async (vehicle) => {
  let i = 0;
  // checks if the vehicle has no trips -> marks it staticly on map
  if (!vehicle.routeToUser)
    return;

  // check which kind of trip is the current one
  currentRoute = 'routeToUser'//vehicle?.routeToUser ? 'routeToUser' : 'routeWithUser'
  // continue from last point (index)
  if (vehicle[currentRoute].index) i = vehicle[currentRoute].index.step;

  // if trip exists, demo vehicle trip
  if (!vehicle[currentRoute].steps) return;
  while (i < vehicle[currentRoute].steps.length) {
    // console.log(i, vehicle[currentRoute].steps.length);
    // creating delay
    await delay(vehicle[currentRoute].steps[i].duration.value * 1000 / demoSpeed);
    // moving the vehicle to the next step
    await vehicleRef.child(vehicle.plateNumber).child('currentLocation').child('location').set({ lat: vehicle[currentRoute].steps[i].start_location.lat, lng: vehicle[currentRoute].steps[i].start_location.lng });
    await vehicleRef.child(vehicle.plateNumber).child(currentRoute).child('index').set({ step: ++i });
    await vehicleRef.child(vehicle.plateNumber).child('routeToUser').child('steps').once('value', snapshot => {
      if (!snapshot.val()) vehicleRef.child(vehicle.plateNumber).child('routeToUser').set(null);
    })
  }

  // at this point vehicle has arrived to his destination!
  // now we need to update his address and location to the trip end point
  let address = vehicle[currentRoute].end_address;
  let location = { lat: vehicle[currentRoute].end_location.lat, lng: vehicle[currentRoute].end_location.lng };
  vehicleRef.child(vehicle.plateNumber).child('currentLocation').set({ address, location });

  // adding the finished trip to history
  // vehicleRef.child(vehicle.plateNumber).once("value", snapshot => {
  //   if (snapshot.val().ridesCompleted) {
  //     let ridesCompletedArray = snapshot.val().ridesCompleted;
  //     ridesCompletedArray.push(vehicle.currentTrip);
  //     vehicleRef.child(vehicle.plateNumber).child('ridesCompleted').set(ridesCompletedArray);
  //   }
  //   else vehicleRef.child(vehicle.plateNumber).child('ridesCompleted').set([vehicle[currentRoute]]);
  // });
  let message;
  await vehicleRef.child(vehicle.plateNumber).child('routeToUser').once('value', vehicleSnapshot => {

    // create the message to send to the user that the vehicle has arrived and will be waiting for him.
    usersRef.child(vehicleSnapshot.val().user_id).once('value', userSnapshot => {
      console.log('getting user information')
      message = {
        to: userSnapshot.val().token,
        sound: 'default',
        title: `${userSnapshot.val().firstName}, Your vehicle has arrived`,
        body: `It's plate number is ${vehicle.plateNumber}`,
        data: { someData: 'goes here' },
      }

      // console.log('im here', snapshot.val());
      if (vehicleSnapshot.val()?.trip_type === 'to_user') {
        console.log('in the if statement')
        usersRef.child(vehicleSnapshot.val().user_id).child('trip').set(null);
        vehicleRef.child(vehicle.plateNumber).child('routeToUser').set(null);
        vehicleRef.child(vehicle.plateNumber).child('routeWithUser').set(null);

        // push the notification to the user of the notification of the user the notification of the users notifications
        sendPushNotification(message)
      }
    });
  })
}

const delay = ms => new Promise(res => setTimeout(res, ms))


// // EXPO
// ~~ Send push notifications to user ~~
async function sendPushNotification(message) {
  console.log('sending a message to the user', message)
  // await axios
  //   .post(
  //     ``, { message }
  //   )
  //   .then((response) => response)
  //   .catch((error) => console.log(error));

  await axios.post('https://exp.host/--/api/v2/push/send', message)
    .then(function (response) {
      console.log('message has been sent');
      console.log(response)
    })
    .catch(function (error) {
      console.log('message has not been sent');
    });

  // await fetch('https://exp.host/--/api/v2/push/send', {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Accept-encoding': 'gzip, deflate',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(message),
  // });
}


// // Create a new Expo SDK client
// // optionally providing an access token if you have enabled push security
// // let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

// // Create the messages that you want to send to clients
// let messages = [];
// for (let pushToken of somePushTokens) {
//   // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

//   // Check that all your push tokens appear to be valid Expo push tokens
//   if (!Expo.isExpoPushToken(pushToken)) {
//     console.error(`Push token ${pushToken} is not a valid Expo push token`);
//     continue;
//   }

//   // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
//   messages.push({
//     to: pushToken,
//     sound: 'default',
//     body: 'This is a test notification',
//     data: { withSome: 'data' },
//   })
// }

// // The Expo push notification service accepts batches of notifications so
// // that you don't need to send 1000 requests to send 1000 notifications. We
// // recommend you batch your notifications to reduce the number of requests
// // and to compress them (notifications with similar content will get
// // compressed).
// let chunks = expo.chunkPushNotifications(messages);
// let tickets = [];
// (async () => {
//   // Send the chunks to the Expo push notification service. There are
//   // different strategies you could use. A simple one is to send one chunk at a
//   // time, which nicely spreads the load out over time:
//   for (let chunk of chunks) {
//     try {
//       let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//       console.log(ticketChunk);
//       tickets.push(...ticketChunk);
//       // NOTE: If a ticket contains an error code in ticket.details.error, you
//       // must handle it appropriately. The error codes are listed in the Expo
//       // documentation:
//       // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
//     } catch (error) {
//       console.error(error);
//     }
//   }
// })();


// // Later, after the Expo push notification service has delivered the
// // notifications to Apple or Google (usually quickly, but allow the the service
// // up to 30 minutes when under load), a "receipt" for each notification is
// // created. The receipts will be available for at least a day; stale receipts
// // are deleted.
// //
// // The ID of each receipt is sent back in the response "ticket" for each
// // notification. In summary, sending a notification produces a ticket, which
// // contains a receipt ID you later use to get the receipt.
// //
// // The receipts may contain error codes to which you must respond. In
// // particular, Apple or Google may block apps that continue to send
// // notifications to devices that have blocked notifications or have uninstalled
// // your app. Expo does not control this policy and sends back the feedback from
// // Apple and Google so you can handle it appropriately.
// let receiptIds = [];
// for (let ticket of tickets) {
//   // NOTE: Not all tickets have IDs; for example, tickets for notifications
//   // that could not be enqueued will have error information and no receipt ID.
//   if (ticket.id) {
//     receiptIds.push(ticket.id);
//   }
// }

// let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
// (async () => {
//   // Like sending notifications, there are different strategies you could use
//   // to retrieve batches of receipts from the Expo service.
//   for (let chunk of receiptIdChunks) {
//     try {
//       let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
//       console.log(receipts);

//       // The receipts specify whether Apple or Google successfully received the
//       // notification and information about an error, if one occurred.
//       for (let receiptId in receipts) {
//         let { status, message, details } = receipts[receiptId];
//         if (status === 'ok') {
//           continue;
//         } else if (status === 'error') {
//           console.error(
//             `There was an error sending a notification: ${message}`
//           );
//           if (details && details.error) {
//             // The error codes are listed in the Expo documentation:
//             // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
//             // You must handle the errors appropriately.
//             console.error(`The error code is ${details.error}`);
//           }
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
// })();

// const testPushNotifications = (token) => {
//   const message = [{
//     to: token,
//     sound: 'default',
//     body: 'This is a test notification',
//     data: { withSome: 'data' },
//   }]
//     // let chuck = Expo.chunkPushNotifications(messages)
//     (async () => {
//       // Send the chunks to the Expo push notification service. There are
//       // different strategies you could use. A simple one is to send one chunk at a
//       // time, which nicely spreads the load out over time:
//       try {
//         let ticketChunk = await Expo.sendPushNotificationsAsync(message);
//         console.log(ticketChunk);
//         tickets.push(...ticketChunk);
//         // NOTE: If a ticket contains an error code in ticket.details.error, you
//         // must handle it appropriately. The error codes are listed in the Expo
//         // documentation:
//         // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
//       } catch (error) {
//         console.error(error);
//       }
//     })
// }