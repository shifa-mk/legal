import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/auth.slice";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PoliceDashboard from "./pages/PoliceDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AskAI from "./pages/AskAI";
import SectionDetails from "./pages/SectionDetails";
import Section from "./pages/Section";
import Navbar from "./components/Navbar";
import Signup from "./pages/SignUp";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
export default function App() {
const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        dispatch(setUser(JSON.parse(storedUser)));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PoliceDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/sections" element={<Section />} />
          <Route path="/sections/:id" element={<SectionDetails />} />
          <Route path="/ask" element={<AskAI />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer/>
    </>
  );
}
