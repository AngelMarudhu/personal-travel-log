import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, authRequired, role }) => {
  const { token, user } = useSelector((state) => state.auth);
  // Location is used to store the current location so we can redirect the user back to the page they were trying to access after loggin so we need to check that user is authenticated or not if not authenticated we need throw away from the page to login page

  const location = useLocation();
  //  this one is have a token and tyring to come out from the authenticated page which is home page to login page we need to again redirect to home page or admin page based on role user
  if (!authRequired && token) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/home"} replace />;
  }
  //  some page we need authenticated user so that time we need to check that user is authenticated or not if not authenticated we need to throw away from the where they are
  if (authRequired && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  //  if we have a token and we have a role and we need to check that user is which role so we need to check based one role we need to redirect to the user to that page....
  if (authRequired && token && role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/home"} replace />;
  }

  //// If none of the conditions are met, render the children (the protected component)
  return children;
};

export default ProtectedRoute;
