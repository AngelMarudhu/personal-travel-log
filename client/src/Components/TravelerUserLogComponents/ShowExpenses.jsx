import React from "react";

const ShowExpenses = ({ logs }) => {
  return (
    <section className="w-full p-4">
      <div>
        <h1 className="w-full text-center text-xl border-b-2 border-gray-200 break-words focus:border-b-2 focus:outline-none resize-none">
          Total Expenses: {logs?.cost}
        </h1>
        {logs?.expenses !== null && logs?.expenses ? (
          <div className="capitalize">
            <h1>Travel Mode: {logs?.expenses?.transPort?.mode}</h1>
            <h1>
              Cost Of Transport: {logs?.expenses?.transPort?.fuelOrTicketCost}
            </h1>
            <h1>Accomodation: {logs?.expenses?.accomodation}</h1>
            <h1>Food: {logs?.expenses?.food}</h1>
            <h1>Activities: {logs?.expenses?.activities}</h1>
          </div>
        ) : (
          <h1 className="text-center mt-4">Expenses Didn't Updated Yet</h1>
        )}
      </div>
    </section>
  );
};

export default ShowExpenses;
