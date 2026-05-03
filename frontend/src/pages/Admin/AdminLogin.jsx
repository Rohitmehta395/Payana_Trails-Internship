import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";

const AdminLogin = () => {
  const [step, setStep] = useState("login"); // 'login', 'forgot', 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" }); // Clear previous messages
    try {
      const data = await api.adminLogin({ email, password });
      sessionStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Login failed",
      });
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await api.adminForgotPassword(email);
      setStep("reset");
      setMessage({ type: "success", text: "OTP sent to your email." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to send OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await api.adminResetPassword({
        email,
        otp,
        newPassword: password,
      });
      setStep("login");
      setPassword("");
      setShowPassword(false);
      setMessage({
        type: "success",
        text: "Password reset successful. Please log in.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Invalid OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3EFE9] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#4A3B2A]">
            {step === "login"
              ? "Admin Login"
              : step === "forgot"
                ? "Reset Password"
                : "Enter OTP"}
          </h2>
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm text-center font-medium ${message.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"}`}
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
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4A3B2A] focus:border-[#4A3B2A] focus:z-10 sm:text-sm transition-shadow"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4A3B2A] focus:border-[#4A3B2A] focus:z-10 sm:text-sm pr-10 transition-shadow"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  /* Added z-20 to fix the clicking issue */
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 text-gray-400 hover:text-[#4A3B2A] focus:outline-none transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.978 9.978 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setStep("forgot");
                  setMessage({ type: "", text: "" });
                }}
                className="text-sm font-medium text-[#4A3B2A] hover:opacity-80 transition-opacity"
              >
                Forgot your password?
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-[#F3EFE9] bg-[#4A3B2A] hover:bg-[#3d3022] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A3B2A] transition-colors duration-200 shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#F3EFE9]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {step === "forgot" && (
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            <input
              type="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4A3B2A] focus:border-[#4A3B2A] sm:text-sm transition-shadow"
              placeholder="Admin Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-[#F3EFE9] bg-[#4A3B2A] hover:bg-[#3d3022] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A3B2A] transition-colors duration-200 shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#F3EFE9]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("login");
                setMessage({ type: "", text: "" });
              }}
              className="w-full text-sm font-medium text-[#4A3B2A] hover:opacity-80 text-center block transition-opacity"
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
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4A3B2A] focus:border-[#4A3B2A] sm:text-sm transition-shadow"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4A3B2A] focus:border-[#4A3B2A] sm:text-sm pr-10 transition-shadow"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  /* Added z-20 to fix the clicking issue */
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 text-gray-400 hover:text-[#4A3B2A] focus:outline-none transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.978 9.978 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-[#F3EFE9] bg-[#4A3B2A] hover:bg-[#3d3022] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A3B2A] transition-colors duration-200 shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#F3EFE9]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>

      <Link
        to="/"
        className="mt-6 flex items-center justify-center text-sm font-medium text-[#4A3B2A] hover:opacity-80 transition-opacity"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Website
      </Link>
    </div>
  );
};

export default AdminLogin;
