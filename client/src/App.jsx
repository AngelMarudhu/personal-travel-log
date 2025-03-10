import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./CustomHooks/ProtectedRoute";

const Home = lazy(() => import("./Pages/Traveler/Home"));
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const RegisterPage = lazy(() => import("./Pages/RegisterPage"));
const UserLog = lazy(() => import("./Pages/Traveler/UserLog"));
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const SearchResult = lazy(() => import("./Components/SearchResults"));

// console.log(navigator.geolocation.getCurrentPosition((e) => console.log(e)));

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute authRequired={false}>
                <Suspense fallback={<div>Loading...</div>}>
                  <RegisterPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute authRequired={false}>
                <Suspense fallback={<div>Loading...</div>}>
                  <LoginPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute authRequired={true} role="traveler">
                <Suspense fallback={<div>Loading...</div>}>
                  <Home />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute authRequired={true} role="traveler">
                <Suspense fallback={<div>Loading...</div>}>
                  <UserLog />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute authRequired={true} role="admin">
                <Suspense fallback={<div>Loading...</div>}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-results"
            element={
              <ProtectedRoute authRequired={true} role="traveler">
                <Suspense fallback={<div>Loading...</div>}>
                  <SearchResult />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
