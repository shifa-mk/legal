import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import PoliceDashboard from "./pages/PoliceDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AskAI from "./pages/AskAI.jsx";
import SectionDetails from "./pages/SectionDetails.jsx";
import Section from "./pages/Section.jsx";
import Navbar from "./components/Navbar.jsx";
import Signup from "./pages/SignUp.jsx";
import Profile from "./components/Profile.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <div >
        <Routes>
          <Route path="/" element={<Login />} />
           <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PoliceDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/sections" element={<Section />} />
          <Route path="/sections/:id" element={<SectionDetails />} />
          <Route path="/ask" element={<AskAI />} />
        </Routes>
      </div>
    </>
  );
}
