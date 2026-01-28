import { Grid, TextField, Button, Box, Snackbar, Alert, InputAdornment, IconButton, Divider, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, register } from "../../Redux/Auth/Action";
import { Fragment, useEffect, useState } from "react";
import { Visibility, VisibilityOff, Person, Email, Lock, CheckCircle } from "@mui/icons-material";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export default function RegisterForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    
    const { auth } = useSelector((store) => store);
    const handleClose = () => setOpenSnackBar(false);

    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        if (jwt) {
            dispatch(getUser(jwt));
        }
    }, [jwt, dispatch]);

    useEffect(() => {
        if (auth.user) {
            setOpenSnackBar(true);
            setTimeout(() => {
                if (auth.user.role === 'ADMIN') {
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            }, 1000);
        }
        if (auth.error) {
            setSnackbarMessage(auth.error);
            setSnackbarSeverity("error");
            setOpenSnackBar(true);
        }
    }, [auth.user, auth.error, navigate]);

    // OTP Timer countdown
    useEffect(() => {
        let interval;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    const handleSendOTP = async () => {
        if (!email) {
            setSnackbarMessage("Please enter your email address");
            setSnackbarSeverity("error");
            setOpenSnackBar(true);
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setSnackbarMessage("Please enter a valid email address");
            setSnackbarSeverity("error");
            setOpenSnackBar(true);
            return;
        }

        setSendingOtp(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/otp/send`, { email });
            
            if (response.data.success) {
                setOtpSent(true);
                setOtpTimer(600); // 10 minutes in seconds
                setSnackbarMessage("OTP sent successfully! Check your email.");
                setSnackbarSeverity("success");
                setOpenSnackBar(true);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
            setOpenSnackBar(true);
        } finally {
            setSendingOtp(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            setSnackbarMessage("Please enter the OTP");
            setSnackbarSeverity("error");
            setOpenSnackBar(true);
            return;
        }

        if (otp.length !== 6) {
            setSnackbarMessage("OTP must be 6 digits");
            setSnackbarSeverity("error");
            setOpenSnackBar(true);
            return;
        }

        setVerifyingOtp(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/otp/verify`, { 
                email, 
                otp 
            });
            
            if (response.data.verified) {
                setOtpVerified(true);
                setSnackbarMessage("Email verified successfully! You can now complete registration.");
                setSnackbarSeverity("success");
                setOpenSnackBar(true);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again.";
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
            setOpenSnackBar(true);
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleResendOTP = async () => {
        setSendingOtp(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/otp/resend`, { email });
            
            if (response.data.success) {
                setOtpTimer(600); // Reset timer to 10 minutes
                setOtp(""); // Clear OTP input
                setSnackbarMessage("New OTP sent successfully!");
                setSnackbarSeverity("success");
                setOpenSnackBar(true);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to resend OTP.";
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
            setOpenSnackBar(true);
        } finally {
            setSendingOtp(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!otpVerified) {
            setSnackbarMessage("Please verify your email with OTP first");
            setSnackbarSeverity("error");
            setOpenSnackBar(true);
            return;
        }

        const data = new FormData(event.currentTarget);

        // Validate mobile number
        const mobile = data.get("mobile");
        if (mobile && mobile.length !== 10) {
            setSnackbarMessage("Please enter a valid 10-digit mobile number");
            setSnackbarSeverity("error");
            setOpenSnackBar(true);
            return;
        }
        
        const userData = {
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
            email: email,
            mobile: mobile,
            password: data.get("password"),
        };
        
        dispatch(register(userData));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="px-8 pt-8 pb-4 text-center">
                        <span className="text-3xl font-bold">
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Shop</span>
                            <span className="text-yellow-500">Kart</span>
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Create account</h1>
                        <p className="text-gray-600 text-sm">
                            Sign up to start shopping and explore exclusive deals.
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="px-8 pb-8">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {/* Email with OTP Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Email sx={{ fontSize: 20, color: otpVerified ? '#10b981' : '#9155FD' }} />
                                            </div>
                                            <input
                                                required
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={otpVerified}
                                                autoComplete="email"
                                                className={`pl-10 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                                                    otpVerified ? 'bg-green-50 border-green-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {otpVerified && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    <CheckCircle sx={{ fontSize: 20, color: '#10b981' }} />
                                                </div>
                                            )}
                                        </div>
                                        {!otpVerified && (
                                            <button
                                                type="button"
                                                onClick={handleSendOTP}
                                                disabled={sendingOtp || otpSent}
                                                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                                                    sendingOtp || otpSent
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                                }`}
                                            >
                                                {sendingOtp ? <CircularProgress size={20} color="inherit" /> : otpSent ? 'Sent' : 'Send OTP'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* OTP Verification Section */}
                                {otpSent && !otpVerified && (
                                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-purple-900">
                                                Enter 6-digit OTP sent to your email
                                            </p>
                                            {otpTimer > 0 && (
                                                <span className="text-xs font-semibold text-purple-600">
                                                    ⏱️ {formatTime(otpTimer)}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                    setOtp(value);
                                                }}
                                                placeholder="Enter OTP"
                                                maxLength={6}
                                                className="flex-1 px-4 py-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-center text-lg font-mono tracking-widest"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleVerifyOTP}
                                                disabled={verifyingOtp || otp.length !== 6}
                                                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                                                    verifyingOtp || otp.length !== 6
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                            >
                                                {verifyingOtp ? <CircularProgress size={20} color="inherit" /> : 'Verify'}
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-600">Didn't receive OTP?</span>
                                            <button
                                                type="button"
                                                onClick={handleResendOTP}
                                                disabled={sendingOtp || otpTimer > 0}
                                                className={`font-semibold ${
                                                    sendingOtp || otpTimer > 0
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-purple-600 hover:text-purple-700 hover:underline'
                                                }`}
                                            >
                                                Resend OTP
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Rest of the form - only show after OTP verification */}
                                {otpVerified && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    First Name <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Person sx={{ fontSize: 20, color: '#9155FD' }} />
                                                    </div>
                                                    <input
                                                        required
                                                        id="firstName"
                                                        name="firstName"
                                                        type="text"
                                                        autoComplete="given-name"
                                                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Last Name <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Person sx={{ fontSize: 20, color: '#9155FD' }} />
                                                    </div>
                                                    <input
                                                        required
                                                        id="lastName"
                                                        name="lastName"
                                                        type="text"
                                                        autoComplete="family-name"
                                                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mobile Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-purple-600 font-semibold">📱</span>
                                                </div>
                                                <input
                                                    required
                                                    id="mobile"
                                                    name="mobile"
                                                    type="tel"
                                                    autoComplete="tel"
                                                    placeholder="Enter mobile number"
                                                    pattern="[0-9]{10}"
                                                    title="Please enter a valid 10-digit mobile number"
                                                    maxLength="10"
                                                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                                    onInput={(e) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Password <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock sx={{ fontSize: 20, color: '#9155FD' }} />
                                                </div>
                                                <input
                                                    required
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    autoComplete="new-password"
                                                    className="pl-10 pr-12 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff sx={{ fontSize: 20, color: '#9155FD' }} />
                                                    ) : (
                                                        <Visibility sx={{ fontSize: 20, color: '#9155FD' }} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                id="terms"
                                                type="checkbox"
                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                                By signing up you agree to our{' '}
                                                <span className="text-purple-600 hover:underline cursor-pointer font-medium">
                                                    Terms
                                                </span>{' '}
                                                and{' '}
                                                <span className="text-purple-600 hover:underline cursor-pointer font-medium">
                                                    Privacy
                                                </span>
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-3 px-4 rounded-xl text-white font-semibold text-base bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Register
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar 
                open={openSnackBar} 
                autoHideDuration={6000} 
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleClose} 
                    severity={snackbarSeverity}
                    sx={{ 
                        width: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                >
                    {snackbarMessage || (auth.error ? auth.error : auth.user ? "Registration successful! Redirecting..." : "")}
                </Alert>
            </Snackbar>
        </div>
    );
}