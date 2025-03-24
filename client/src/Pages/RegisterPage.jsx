import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../Features/AuthFeatures";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = useSelector((state) => state.auth);

  useEffect(() => {
    if (data.isRegistered) {
      navigate("/login");
    }
  }, [data.isRegistered]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-2 p-5 bor-rad-10">
        <h1 className="text-2xl mb-5 border-b-2 border-t-2 text-center p-3">
          Welcome to share your adventure experience
        </h1>
        <form action="" onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Name"
            name="name"
            onChange={(e) => handleChange(e)}
            value={formData.name}
            required={true}
            className="p-3 border-1 rounded-md text-bg bg-gray-100"
          />
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
            {data.isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        {data.error && <p className=" text-red-500 ">{data.error.message}</p>}
        <a href="/login">Already Registered</a>
      </div>
    </div>
  );
};

export default RegisterPage;
