import React from "react";

const AdminSearchUsers = ({
  users,
  searchQuery,
  setSelectedUserFromSearch,
  closeFocus,
}) => {
  const filterdUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full h-full p-4">
      <h1 className="border-b-1 mb-2 border-gray-300 text-center">
        Find your right user here hunt user here
      </h1>
      <div>
        {filterdUsers.map((user) => (
          <div
            key={user._id}
            className="flex m-3 shadow-2xl bg-gray-100 rounded-2xl justify-between items-center border-b-2 border-gray-300 p-2 cursor-pointer"
          >
            <h1 className="text-red-300">
              <span className="text-black">Name: </span>
              {user.name}
            </h1>
            <div>
              <input
                type="radio"
                onChange={(e) => {
                  setSelectedUserFromSearch(e.target.id);
                  closeFocus(false);
                }}
                name="select"
                id={`${user._id}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AdminSearchUsers);
