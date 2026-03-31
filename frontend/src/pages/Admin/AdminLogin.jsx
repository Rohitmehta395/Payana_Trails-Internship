import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [step, setStep] = useState("login"); // 'login', 'forgot', 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:8000/admin/login", {
        email,
        password,
      });
      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Login failed",
      });
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      await axios.post("http://localhost:8000/admin/forgot-password", {
        email,
      });
      setStep("reset");
      setMessage({ type: "success", text: "OTP sent to your email." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to send OTP",
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/admin/reset-password", {
        email,
        otp,
        newPassword: password,
      });
      setStep("login");
      setPassword("");
      setMessage({
        type: "success",
        text: "Password reset successful. Please log in.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Invalid OTP",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === "login"
              ? "Admin Portal"
              : step === "forgot"
                ? "Reset Password"
                : "Enter OTP"}
          </h2>
        </div>

        {message.text && (
          <div
            className={`p-3 rounded text-sm text-center ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {message.text}
          </div>
        )}

        {/* LOGIN FORM */}
        {step === "login" && (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setStep("forgot")}
                className="text-sm font-medium text-amber-600 hover:text-amber-500"
              >
                Forgot your password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              Sign in
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {step === "forgot" && (
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            <input
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Admin Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 transition-colors"
            >
              Send OTP
            </button>
            <button
              type="button"
              onClick={() => setStep("login")}
              className="w-full text-sm font-medium text-gray-600 hover:text-gray-900 text-center block"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* RESET PASSWORD FORM */}
        {step === "reset" && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <input
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 transition-colors"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
