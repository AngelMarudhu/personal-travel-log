import travelLogSchema from "../../Models/travelLogSchema.js";

export const searchByLocation = async (req, res) => {
  try {
    ///// its an from and to location searching
    const { fromLocation, toLocation } = req.query;
    // console.log(fromLocation, toLocation);

    // let filterLocation = {};

    // if (fromLocation && toLocation) {
    //   filterLocation = {
    //     toLocation: toLocation,
    //     location: fromLocation,
    //   };
    // }

    // console.log(filterLocation);

    const searchLogs = await travelLogSchema.find({
      fromLocation: fromLocation,
      location: toLocation,
    });
    // console.log(searchLogs);

    if (searchLogs.length === 0) {
      return res.status(400).json({ message: "No logs found" });
    }

    res.status(200).json({ searchLogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findNearbyLocation = async (req, res) => {
  try {
    // const currentLocation = req.body;
    const currentLocation = req.query;

    // console.log(parseFloat(currentLocation.lat));

    const maxDistance = 50000; //// 100 km 1000 = 1km

    let nearByLocation = await travelLogSchema.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(currentLocation.lat),
              parseFloat(currentLocation.lng),
            ],
          },
          $maxDistance: maxDistance,
        },
      },
    });

    if (!nearByLocation) {
      return res.status(400).json({ message: "sorry no location found" });
    }

    res.status(200).json({ nearByLocation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// findNearbyLocation();
