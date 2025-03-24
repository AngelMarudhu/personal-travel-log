import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpensesToDB } from "../../../Features/UserLogFeature";
import { resetPreviousSession } from "../../../Redux/UserLogSlice";

const vehicleTypes = [
  {
    name: "Bus",
  },
  {
    name: "Train",
  },
  {
    name: "Flight",
  },
  {
    name: "Car",
  },
];

const Expenses = ({ closeExpensePopup, logs }) => {
  const { addingExpense } = useSelector((state) => state.userLog);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [expenses, setExpenses] = useState({
    transPort: {
      mode: "car",
      fuelOrTicketCost: "",
    },
    accomodation: "",
    food: "",
    activities: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (addingExpense.isAddedExpenses) {
      closeExpensePopup();
      dispatch(resetPreviousSession());
    }
  }, [addingExpense.isAddedExpenses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isNaN(value) && name !== "transPort.mode") {
      setError("Please enter a number");
      return;
    }
    setError(null);

    if (name === "transPort.mode") {
      setExpenses((prev) => {
        return {
          ...prev,
          transPort: {
            ...prev.transPort,
            mode: value,
          },
        };
      });
    }

    if (name === "transPort.fuelOrTicketCost") {
      setExpenses((prev) => {
        return {
          ...prev,
          transPort: {
            ...prev.transPort,
            fuelOrTicketCost: value,
          },
        };
      });
    }

    setExpenses((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !expenses.accomodation ||
      !expenses.food ||
      !expenses.activities ||
      !expenses.transPort.mode ||
      !expenses.transPort.fuelOrTicketCost
    ) {
      setError("Please add your expenses first");
      return;
    }

    dispatch(
      addExpensesToDB({
        data: {
          travelLog: logs._id,
          transPort: {
            mode: expenses.transPort.mode.toLowerCase(),
            fuelOrTicketCost: parseInt(expenses.transPort.fuelOrTicketCost),
          },
          accomodation: parseInt(expenses.accomodation),
          food: parseInt(expenses.food),
          activities: parseInt(expenses.activities),
          createdAt: new Date(),
        },
      })
    );
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!expenses.accomodation || !expenses.food || !expenses.activities) {
      setError("Please add your expenses first");
      return;
    }

    const total = parseInt(logs.cost);
    const totalExpenses =
      parseInt(expenses.accomodation) +
      parseInt(expenses.food) +
      parseInt(expenses.activities) +
      parseInt(expenses.transPort.fuelOrTicketCost);

    const balance = total - totalExpenses;

    if (balance < 0) {
      setError("You don't have enough money to cover the expenses");
      setBalance(null);
      return;
    }

    setBalance(balance);
  };

  // console.log(addingExpense);

  return (
    <section className="fixed inset-0 top-0 left-0 w-full h-full md:w-2/3 md:h-2/3  m-auto bg-black/100 z-50 p-10 rounded-lg">
      <div className="text-white">
        <div className="flex justify-between items-center">
          <h1>Expenses</h1>
          <button
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              closeExpensePopup();
            }}
          >
            ❌
          </button>
        </div>

        <div className="w-full h-full mt-5 flex flex-col justify-center items-center">
          {balance !== null ? (
            <div>
              <h1 className="mb-3">Your Balance: {balance}</h1>
            </div>
          ) : (
            <div>
              <h2 className="mb-3">Total Expenses: {logs.cost}</h2>
            </div>
          )}
          <div className="w-full">
            <form
              action=""
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center gap-3 "
            >
              <select
                className="w-full md:w-80 m-auto border-1 border-gray-400 rounded-lg p-1"
                name="transPort.mode"
                value={expenses.transPort.mode}
                onChange={handleChange}
              >
                <option className="text-black" value=" ">
                  Select Vehicle
                </option>
                {vehicleTypes.map((vehicle) => (
                  <option
                    className="text-black"
                    key={vehicle.name}
                    value={vehicle.name}
                  >
                    {vehicle.name}
                  </option>
                ))}
              </select>
              {vehicleTypes.some(
                (vehicle) => vehicle.name === expenses.transPort.mode
              ) && (
                <div className="w-full flex justify-center items-center">
                  <input
                    className="w-full md:w-80 m-auto border-1 border-gray-400 rounded-lg p-1"
                    type="text"
                    name="transPort.fuelOrTicketCost"
                    value={expenses.transPort.fuelOrTicketCost}
                    onChange={handleChange}
                    placeholder="Fuel"
                  />
                </div>
              )}
              <input
                className="w-full md:w-80 m-auto border-1 border-gray-400 rounded-lg p-1"
                type="text"
                name="accomodation"
                value={expenses.accomodation}
                onChange={handleChange}
                placeholder="Accomodation"
              />
              <input
                className="w-full md:w-80 m-auto border-1 border-gray-400 rounded-lg p-1"
                type="text"
                name="food"
                value={expenses.food}
                onChange={handleChange}
                placeholder="Food"
              />
              <input
                className="w-full md:w-80 m-auto border-1 border-gray-400 rounded-lg p-1"
                type="text"
                name="activities"
                value={expenses.activities}
                onChange={handleChange}
                placeholder="Activities"
              />
              <button
                onClick={handleCalculate}
                className="flex cursor-pointer items-center justify-center w-full md:w-80 m-auto border-1 border-gray-400 rounded-lg p-1"
              >
                Calculate
              </button>
              <button
                className="flex cursor-pointer items-center justify-center w-full md:w-80 m-auto mt-2 border-1 border-gray-400 rounded-lg p-1"
                type="submit"
              >
                Add Expenses To Your Post
              </button>
            </form>
          </div>
          {error && <p className="text-red-500 text-left mt-4">{error}</p>}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Expenses);
