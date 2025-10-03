import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "../utils/axios";

export default function Login() {
  const [input, setInput] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
     const { data } = await api.post("/api/auth/login", input);

if (data.token) {
  toast.success("✅ Successfully logged in!");
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  navigate("/police-dashboard");
}


      // backend expects { username, password }
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Login successful!");
      if (data.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#FFF0DD" }}>
      <form
        className="w-1/2 max-w-md rounded-md p-6 shadow-lg"
        style={{ backgroundColor: "#D1D3D4" }}
        onSubmit={handleLogin}
      >
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: "#E2A16F" }}>
          Login
        </h1>

        {/* Username */}
        <div className="mb-4">
          <Label className="block mb-1" style={{ color: "black" }}>
            Username
          </Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeHandler}
            placeholder="Enter username"
            className="w-full p-2 rounded"
            style={{ border: "1px solid #86B0BD", color: "black" }}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <Label className="block mb-1" style={{ color: "black" }}>
            Password
          </Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeHandler}
            placeholder="Enter password"
            className="w-full p-2 rounded"
            style={{ border: "1px solid #86B0BD", color: "black" }}
          />
        </div>

        {/* Button */}
        {loading ? (
          <Button
            className="w-full my-4 font-bold"
            style={{ backgroundColor: "#E2A16F", color: "#FFF0DD" }}
            disabled
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full my-4 font-bold"
            style={{ backgroundColor: "#E2A16F", color: "#FFF0DD" }}
          >
            Login
          </Button>
        )}

        <p className="text-sm text-center mt-4" style={{ color: "black" }}>
          Don’t have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#E2A16F",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
