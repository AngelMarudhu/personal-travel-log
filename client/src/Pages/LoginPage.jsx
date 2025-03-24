import React, { useState } from "react";
import { loginUser } from "../Features/AuthFeatures";
import { useDispatch, useSelector } from "react-redux";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-2 p-5 bor-rad-10 w-1/2">
        {isLoading ? (
          <h1 className="text-2xl text-center p-3">Loading....</h1>
        ) : (
          <h1 className="text-2xl text-center p-3">
            Welcome to share your adventure experience
          </h1>
        )}
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex flex-col gap-5  m-auto"
        >
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
            value={formData.email}
            required={true}
            className="p-3 border-1 rounded-md text-bg bg-gray-100"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
            value={formData.password}
            required={true}
            className="p-3 border-1 rounded-md text-bg bg-gray-100"
          />
          <button
            className="p-3 border w-30 m-auto rounded-lg cursor-pointer "
            type="submit"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-400">{error.message} by admin</p>}
        <a href="/">New Register</a>
      </div>
    </div>
  );
};

export default LoginPage;
