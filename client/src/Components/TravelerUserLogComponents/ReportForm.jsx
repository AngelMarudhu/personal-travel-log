import React, { useEffect, useState } from "react";
import useSocket from "../../Utils/Socket";
import { IoIosCloseCircle } from "react-icons/io";

const ReportForm = ({ toggleReportForm, log, userId }) => {
  const [reportData, setreportData] = useState({
    reason: "",
    reportedUser: log.user._id,
    reporter: userId,
    createdAt: new Date(),
    reportedType: "other",
  });

  const { reportSpam, reportStatus } = useSocket();
  // console.log(reportStatus);

  useEffect(() => {
    if (reportStatus === "success") {
      toggleReportForm(null);
    }
  }, [reportStatus]);

  const configReportedTypes = [
    {
      value: "spam",
      label: "Spam",
    },
    {
      value: "inappropriate",
      label: "Inappropriate",
    },
    {
      value: "other",
      label: "Other",
    },
  ];

  const handleReportSubmit = (e) => {
    e.preventDefault();
    reportSpam(reportData);
  };

  // console.log(log, userId);

  return (
    <div className="fixed inset-0 flex items-center m-5 justify-center rounded-2xl bg-black bg-opacity-100 z-50">
      <div className="relative bg-white w-[500px] p-6 rounded-lg shadow-lg">
        <IoIosCloseCircle
          className="top-0 mb-10 text-2xl cursor-pointer"
          fill="red"
          onClick={() => toggleReportForm(null)}
        />

        <form
          action=""
          onSubmit={(e) => handleReportSubmit(e)}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            className="border-2 border-gray-300 rounded-lg p-2"
            placeholder="Reason"
            required={true}
            value={reportData.reason}
            onChange={(e) =>
              setreportData({ ...reportData, reason: e.target.value })
            }
          />
          <select
            name="reportedType"
            required={true}
            onChange={(e) => {
              setreportData({ ...reportData, reportedType: e.target.value });
            }}
          >
            <option value="">Choose What You Got</option>
            {configReportedTypes.map((type, index) => (
              <option key={index} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <button type="submit" className="border-2 mt-5 p-3 rounded-lg">
            {reportStatus === "loading" ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
