/* eslint-disable no-unused-vars */
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaCheckCircle } from "react-icons/fa";
import Backdrop from "@mui/material/Backdrop";
import CustomSpinner from "../components/CustomSpinner";

import { useDispatch } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
  signoutSuccess,
} from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // OTP related states
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);

  // Secret key state
  const [secretVerified, setSecretVerified] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

  const handleChange = async (e) => {
    const { type, value, id } = e.target;
    if (type === "radio") {
      const selectedRole = value.trim();
      setFormData({ ...formData, role: selectedRole });
      await triggerSecretKeyModal(selectedRole);
    } else {
      const newValue = value.trim();
      setFormData({ ...formData, [id]: newValue });

      // Reset OTP state on email change
      if (id === 'email') {
        setOtpVerified(false);
        setOtpSent(false);
        setGeneratedOtp(null);
        setOtpTimer(0);
        setErrorMessage(null);
      }
    }
  };

  const handleOtpChange = (e) => setOtp(e.target.value.trim());

  const generateOtp = async () => {
    if (!formData.email) {
      setErrorMessage("Please enter your email first.");
      return;
    }
    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Error sending OTP.");
        setLoading(false);
        return;
      }
      setGeneratedOtp(data.otp);
      setOtpSent(true);
      setOtpTimer(30);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Error sending OTP: " + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const verifyOtp = async () => {
    if (!otp) {
      setErrorMessage("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "OTP verification failed.");
        setLoading(false);
        return;
      }
      setOtpVerified(true);
      setErrorMessage(null);
      setLoading(false);
      MySwal.fire({
        icon: "success",
        title: "OTP Verified Successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error verifying OTP: " + error.message);
      MySwal.fire({
        icon: "error",
        title: "Error verifying OTP",
        text: error.message,
      });
    }
  };

  const triggerSecretKeyModal = async (role) => {
    setSecretVerified(false);
    const { value: secretKey } = await MySwal.fire({
      title: `Enter Secret Key for ${role}`,
      input: "password",
      inputPlaceholder: "Enter your secret key",
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
    });
    const secretMap = {
      Admin: "admin123",
      "Front Desk Operator": "fdo123",
      "Data Entry Operator": "edo123",
      doctor: "doc123",
    };
    if (secretKey !== secretMap[role]) {
      MySwal.fire({
        icon: "error",
        title: "Wrong Secret Key",
        text: "Please enter the correct secret key!",
      });
    } else {
      setSecretVerified(true);
      MySwal.fire({
        icon: "success",
        title: "Secret key verified!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      setErrorMessage("Please fill out all fields.");
      return;
    }
    if (!otpVerified || !secretVerified) {
      setErrorMessage("Please verify your email OTP and secret key.");
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setErrorMessage(data.message || "Sign-in failed.");
        setLoading(false);
        return;
      }
      dispatch(signoutSuccess());
      dispatch(signInSuccess(data));
      setLoading(false);
      switch (data.role) {
        case "Front Desk Operator":
          navigate("/fdo");
          break;
        case "doctor":
          navigate("/doctor");
          break;
        case "Data Entry Operator":
          navigate("/deo");
          break;
        case "Admin":
          navigate("/admin");
          break;
        default:
          break;
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20 dark:bg">
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open
        >
          <CustomSpinner />
        </Backdrop>
      )}

      <div className="shadow-2xl rounded-2xl shadow-slate-800 flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left Branding */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-400 rounded-lg text-white font-bold">
              We ~ Go
            </span>
            <br />
            <br />
            Where compassion meets innovation.
          </Link>
          <p className="text-sm mt-5 dark:text-gray-300">
            Healthcare is the art of compassion, where every touch, every smile,
            and every heartbeat creates a legacy of hope and healing.
          </p>
        </div>

        {/* Right Sign In Form */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <Label value="Your Email id" />
              <TextInput
                type="email"
                placeholder="xyz**@gmail.com"
                id="email"
                onChange={handleChange}
              />
              {otpVerified ? (
                <span className="absolute right-2 top-10 text-green-600 px-1">
                  <FaCheckCircle size={24} />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={generateOtp}
                  className="bg-sky-200 font-semibold rounded-lg px-1 absolute right-2 top-10 text-blue-600 dark:text-white hover:underline dark:bg-slate-400"
                  disabled={otpTimer > 0}
                >
                  {otpTimer > 0 ? `Resend OTP (${otpTimer}s)` : "Send OTP"}
                </button>
              )}
            </div>
            {otpSent && !otpVerified && (
              <div>
                <Label value="Enter OTP" />
                <TextInput
                  type="text"
                  placeholder="Enter OTP"
                  id="otp"
                  onChange={handleOtpChange}
                />
                <Button
                  onClick={verifyOtp}
                  className="mt-2"
                  gradientDuoTone="purpleToBlue"
                >
                  Verify OTP
                </Button>
              </div>
            )}
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <p className="font-bold">Role</p>
            <div className="flex items-center gap-4">
              {['Front Desk Operator','Data Entry Operator','Admin','doctor'].map(role => (
                <label key={role} className="flex items-center"> 
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 border-gray-300 rounded focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                  />
                  <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {role === 'doctor' ? 'Doctor' : role}
                  </span>
                </label>
              ))}
            </div>
            <Button
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="text-sm mt-5 dark:text-gray-300">
            <span>Your health, our promise.</span>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
