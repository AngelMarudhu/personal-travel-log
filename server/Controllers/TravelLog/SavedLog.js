import savedLogSchema from "../../Models/savedLogSchema.js";
import travelLogSchema from "../../Models/travelLogSchema.js";
import UserSchema from "../../Models/UserSchema.js";

export const postSavedLog = async (req, res) => {
  try {
    // console.log(req.body);
    const { travelLogId } = req.body;
    const userId = req.user._id;
    // console.log(travelLogId);

    const user = await UserSchema.findById(userId);
    const travelLog = await travelLogSchema.findById(travelLogId);

    if (!user) {
      return res.status(400).json({ message: "Check user or travel log" });
    }

    if (!travelLog) {
      return res.status(400).json({ message: "travel log not found" });
    }

    const savedLog = await savedLogSchema.findOne({
      user: userId,
      travelLog: travelLogId,
    });

    if (savedLog) {
      return res.status(400).json({ message: "Already saved" });
    }

    await savedLogSchema.create({
      user: userId,
      travelLog: travelLogId,
      savedAt: new Date(),
    });

    res.status(200).json({ message: "Saved Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSavedLog = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserSchema.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const savedLog = await savedLogSchema
      .find({ user: userId })
      .populate({
        path: "travelLog",
        populate: {
          path: "user",
          select: "-password",
        },
      })
      .populate({
        path: "user",
        select: "-password",
      });

    if (!savedLog) {
      return res.status(400).json({ message: "No saved log found" });
    }
    res.status(200).json({ savedLog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSavedLog = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);

    const savedLog = await savedLogSchema.findById(id);
    if (!savedLog) {
      return res.status(400).json({ message: "Saved log not found" });
    }

    await savedLogSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
