import CommendSchema from "../../Models/commendSchema.js";
import travelLogSchema from "../../Models/travelLogSchema.js";
import likeSchema from "../../Models/likeSchema.js";
import userSchema from "../../Models/UserSchema.js";
import bcrypt from "bcryptjs";
import { sentOtp } from "../../Middleware/Nodemailer.js";

let otpStorage = {};

const storedOtp = async (email, otp) => {
  otpStorage[email] = { otp, timeStamp: Date.now() };
  console.log(`stored otp for ${email} is ${otp}`);
};

export const createTravelLog = async (req, res) => {
  try {
    const {
      title,
      description,
      toLocation,
      cost,
      date,
      placesToVisit,
      images,
      fromLocation,
      location,
    } = req.body;

    console.log(req.body);

    // console.log(req.body, "controller");
    /// we got array of places to visit so we need to parse it to array
    const parsedPlacesToVisit = JSON.parse(placesToVisit);
    const userId = req.user._id;

    // console.log(req.files.length);
    const newTravelLog = await travelLogSchema.create({
      title,
      description,
      location,
      toLocation: toLocation.toLowerCase(),
      fromLocation: fromLocation.toLowerCase(),
      cost,
      date,
      placesToVisit: parsedPlacesToVisit,
      images,
      user: userId,
    });

    res
      .status(201)
      .json({ message: "Travel log created successfully", newTravelLog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTravelLog = async (req, res) => {
  try {
    const page = parseInt(req.params.id) || 1;

    const limit = 10;

    //// skip is used to skip the last 10 items and get the next 10 items
    const skip = (page - 1) * limit;

    const travelLogs = await travelLogSchema
      .find()
      .skip(skip)
      .limit(10)
      .populate([{ path: "user", select: "name" }, { path: "expenses" }]);

    const totalCount = await travelLogSchema.countDocuments();

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      travelLogs,
      currentPage: page,
      totalPages,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTravelLog = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, location, cost, date, placesToVisit } =
      req.body;

    console.log(req.body);

    const userId = req.user._id.toString();
    const travelLog = await travelLogSchema.findById(id);

    if (!travelLog) {
      return res.status(404).json({ message: "travel log not found" });
    }

    if (travelLog.user.toString() !== userId) {
      return res
        .status(402)
        .json({ message: "you are not the owner of this travel log" });
    }

    const updatedTravelLog = await travelLogSchema.findByIdAndUpdate(
      id,
      {
        title,
        description,
        toLocation: location.toLowerCase(),
        cost,
        date,
        placesToVisit,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "travel log updated successfully", updatedTravelLog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTravelLog = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user._id.toString();
    const travelLog = await travelLogSchema.findById(id);

    if (!travelLog) {
      return res.status(404).json({ message: "travel log not found" });
    }

    if (travelLog.user.toString() !== userId) {
      return res
        .status(402)
        .json({ message: "you are not the owner of this travel log" });
    }

    await CommendSchema.deleteMany({ travelLog: id });
    await likeSchema.deleteMany({ travelLog: id });
    await travelLogSchema.findByIdAndDelete(id);

    res.status(200).json({ message: "travel log deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTravelLogById = async (req, res) => {
  try {
    const id = req.user._id.toString();

    // console.log(id);

    const yourTravelLogs = await travelLogSchema
      .find({ user: id })
      .populate("expenses");

    if (!yourTravelLogs) {
      return res.status(404).json({ message: "travel log not found" });
    }

    res.status(200).json({ yourTravelLogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTrendingPlaces = async (req, res) => {
  try {
    // console.log("get trending places");
    const threshHold = 4;
    const trendingPlaces = await travelLogSchema.aggregate([
      {
        $match: {
          $expr: { $gte: [{ $size: "$likes" }, threshHold] },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          location: 1,
          likesCount: { $size: "$likes" },
          user: 1,
          createdAt: 1,
        },
      },
      {
        $sort: {
          likesCount: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
    // console.log(trendingPlaces);

    res.status(200).json({ trendingPlaces });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentTravelLog = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const travelLog = await CommendSchema.find({ travelLog: id }).populate(
      "user",
      "name"
    );

    if (!travelLog) {
      return res.status(404).json({ message: "travel log not found" });
    }

    res.status(200).json({ travelLog });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const userSentOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user._id.toString();
    const otp = Math.floor(100000 + Math.random() * 900000);

    const user = await userSchema.findById(userId);
    // console.log(otpStorage);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (user.email !== email) {
      return res.status(400).json({ message: "email not found" });
    }

    // if (otpStorage[email]) {
    //   delete otpStorage[email];
    // }

    storedOtp(email, otp);

    await sentOtp(email, otp);

    res.status(200).json({ message: "otp sent successfully", success: true });

    // console.log(email);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user._id.toString();
    const user = await userSchema.findById(userId);

    if (!otp) {
      return res.status(400).json({ message: "otp not found" });
    }

    // console.log(otpStorage);

    if (otpStorage[user.email].otp !== parseInt(otp)) {
      return res.status(400).json({ message: "otp not verified" });
    }
    ///// five minutes time limit
    if (otpStorage[user.email].timeStamp < Date.now() - 1000 * 60 * 5) {
      return res.status(400).json({ message: "otp expired" });
    }

    res.status(200).json({ message: "otp verified successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user._id.toString();

    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const isPasswordValid = await bcrypt.compare(newPassword, user.password);

    if (isPasswordValid) {
      return res.status(400).json({ message: "new password is same as old" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await userSchema.findByIdAndUpdate(userId, {
      password: newPasswordHash,
    });

    res.status(200).json({ message: "password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const userId = req.user._id.toString();

    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (user.email === newEmail) {
      return res.status(400).json({ message: "new email is same as old" });
    }

    const existingEmailDb = await userSchema.findOne({ email: newEmail });

    if (existingEmailDb) {
      return res.status(400).json({ message: "email already exists" });
    }

    await userSchema.findByIdAndUpdate(userId, { email: newEmail });

    res.status(200).json({ message: "email changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
