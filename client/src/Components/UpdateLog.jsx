import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { resetPreviousSession, showEditLog } from "../Redux/UserLogSlice";
import { updateTravelLog } from "../Features/UserLogFeature";

const UpdateLog = () => {
  const dispatch = useDispatch();
  const { updateLog } = useSelector((state) => state.userLog);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    cost: "",
    location: "",
  });

  useEffect(() => {
    if (updateLog) {
      setFormData({
        title: updateLog.title || "",
        description: updateLog.description || "",
        date: updateLog.date || "",
        cost: updateLog.cost || "",
        location: updateLog.toLocation || "",
      });
    }
  }, [updateLog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);
    dispatch(updateTravelLog({ id: updateLog._id, data: formData }));
    dispatch(showEditLog());
    dispatch(resetPreviousSession());
  };

  const onClose = () => {
    dispatch(showEditLog());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white w-[500px] p-6 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
        >
          <IoClose />
        </button>

        <h1 className="text-xl font-bold text-center mb-4">Marudhu</h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="p-2 border rounded-md"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="p-2 border rounded-md"
          />
          <input
            type="number"
            name="cost"
            placeholder="Cost"
            value={formData.cost}
            onChange={handleChange}
            className="p-2 border rounded-md"
          />
          <input
            type="date"
            name="date"
            value={
              formData.date
                ? new Date(formData.date).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
            className="p-2 border rounded-md"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="p-2 border rounded-md"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md mt-2"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateLog;
