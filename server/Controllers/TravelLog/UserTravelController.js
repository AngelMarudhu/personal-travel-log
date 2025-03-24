import travelLogSchema from "../../Models/travelLogSchema.js";
import userSchema from "../../Models/UserSchema.js";
import expensesSchema from "../../Models/expensesSchema.js";

export const addUserExpenses = async (req, res) => {
  try {
    const { travelLog, transPort, food, createdAt, activities, accomodation } =
      req.body;

    const travelLogData = await travelLogSchema.findById(travelLog);

    if (!travelLogData) {
      return res.status(400).json({ error: "Travel log not found" });
    }

    // if (travelLogData.expenses) {
    //   return res.status(400).json({ error: "Expenses already added" });
    // }

    let expense = await expensesSchema.create({
      travelLog: travelLog,
      transPort: transPort,
      food: food,
      createdAt: createdAt,
      activities: activities,
      accomodation: accomodation,
    });

    await travelLogData.save();

    const log = await travelLogSchema.findByIdAndUpdate(
      travelLog,
      { $set: { expenses: expense } },
      { new: true }
    );
    await log.save();
    res.status(200).json({ message: "Expense added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
