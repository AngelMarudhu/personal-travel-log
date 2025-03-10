import React from "react";

const ConfirmDelete = ({ isOpen, onClose, onConfirm, message }) => {
  // console.log(isOpen);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg text-center">
        <p className="text-gray-700">{message || "Are you sure?"}</p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
