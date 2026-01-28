import React, { useEffect, useState, Fragment } from "react";
import {
    Grid,
    TextField,
    Button,
    Typography,
    Alert,
    Snackbar,
    CircularProgress,
    Box,
    Card,
    CardContent,
    InputAdornment,
    IconButton,
    LinearProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, Email } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    resetPassword,
    validateResetToken,
    clearPasswordMessages,
} from "../../Redux/Auth/Action";

/**
 * Helper: quick password strength estimator
 * Returns { score: 0..100, label }
 */
function estimatePasswordStrength(pw = "") {
    let score = 0;
    if (!pw) return { score, label: "Too short" };
    // length
    score += Math.min(40, pw.length * 4);
    // variety: lower/upper/digits/symbols
    if (/[a-z]/.test(pw)) score += 10;
    if (/[A-Z]/.test(pw)) score += 10;
    if (/\d/.test(pw)) score += 15;
    if (/[^A-Za-z0-9]/.test(pw)) score += 20;
    score = Math.min(100, score);
    let label = "Weak";
    if (score > 80) label = "Strong";
    else if (score > 55) label = "Good";
    else if (score > 30) label = "Fair";
    return { score, label };
}

export default function ResetPasswordForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const { auth } = useSelector((store) => store);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // validate token on mount
    useEffect(() => {
        if (token) {
            dispatch(validateResetToken(token));
        } else {
            navigate("/login");
        }
    }, [token, dispatch, navigate]);

    // respond to reset results
    useEffect(() => {
        if (auth.resetPasswordMessage) {
            setOpenSnackBar(true);
            // auto-redirect after success (keeps your original behavior)
            setTimeout(() => {
                navigate("/login");
            }, 1600);
        }
        if (auth.resetPasswordError) {
            setOpenSnackBar(true);
        }
    }, [auth.resetPasswordMessage, auth.resetPasswordError, navigate]);

    const handleClose = () => {
        setOpenSnackBar(false);
        dispatch(clearPasswordMessages());
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // basic validation
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            return;
        }
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        setPasswordError("");
        dispatch(resetPassword(token, password));
    };

    // token validating state
    if (auth.isValidatingToken) {
        return (
            <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (auth.isTokenValid === false) {
        return (
            <Box sx={{ maxWidth: 640, mx: "auto", mt: 8, px: 2 }}>
                <Alert severity="error">Invalid or expired reset link. Please request a new password reset.</Alert>
                <Button onClick={() => navigate("/forgot-password")} variant="contained" fullWidth sx={{ mt: 2, bgcolor: "#7B61FF" }}>
                    Back to Forgot Password
                </Button>
            </Box>
        );
    }

    const strength = estimatePasswordStrength(password);

    return (
        <Fragment>
            <Box sx={{ background: "#f8fafc", minHeight: "80vh", py: 8 }}>
                <Box sx={{ maxWidth: 980, mx: "auto", px: 2 }}>
                    <Card
                        elevation={10}
                        sx={{
                            minHeight: 440,
                            maxWidth: 800,
                            width: "100%",
                            display: "flex",
                            borderRadius: 4,
                            overflow: "hidden",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                        }}
                    >
                        {/* Left visual column (optional branding) */}
                        <Box
                            sx={{
                                display: { xs: "none", md: "flex" },
                                width: 320,
                                background:
                                    "linear-gradient(180deg, rgba(123,97,255,0.95) 0%, rgba(255,122,172,0.95) 100%)",
                                color: "white",
                                p: 4,
                                flexDirection: "column",
                                justifyContent: "center",
                                gap: 2,
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                <span style={{ WebkitBackgroundClip: "text", color: "white" }}>Shop</span>
                                <span style={{ color: "#FDE68A" }}>Kart</span>
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.95 }}>
                                Reset your password securely and return to shopping. We protect your account with industry standard security.
                            </Typography>
                        </Box>

                        {/* Right: form area */}
                        <CardContent sx={{ flex: 1, p: { xs: 4, sm: 6 } }}>
                            <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 1 }}>
                                Reset Password
                            </Typography>
                            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                                Enter your new password below.
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="password"
                                            name="password"
                                            label="New Password"
                                            fullWidth
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            error={!!passwordError}
                                            helperText={password.length > 0 ? `Strength: ${strength.label}` : ""}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton edge="end" onClick={() => setShowPassword(!showPassword)} aria-label="toggle password visibility">
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    "&.Mui-focused": {
                                                        boxShadow: "0 8px 30px rgba(123,97,255,0.08)",
                                                    },
                                                },
                                            }}
                                        />

                                        {/* Password strength bar */}
                                        {password.length > 0 && (
                                            <Box sx={{ mt: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={strength.score}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 2,
                                                        backgroundColor: "rgba(0,0,0,0.06)",
                                                        "& .MuiLinearProgress-bar": {
                                                            background:
                                                                strength.score > 80
                                                                    ? "linear-gradient(90deg,#16A34A,#84CC16)"
                                                                    : strength.score > 55
                                                                        ? "linear-gradient(90deg,#F59E0B,#F97316)"
                                                                        : "linear-gradient(90deg,#EF4444,#F97316)",
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            label="Confirm New Password"
                                            fullWidth
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            error={!!passwordError}
                                            helperText={passwordError}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {/* Empty box to keep symmetry */}
                                                        <Box sx={{ width: 30 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    "&.Mui-focused": {
                                                        boxShadow: "0 8px 30px rgba(123,97,255,0.04)",
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
                                        <Button onClick={() => navigate("/login")} size="small" sx={{ textTransform: "none" }}>
                                            Back to Login
                                        </Button>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            disabled={auth.isLoading}
                                            sx={{
                                                px: 4,
                                                borderRadius: 2,
                                                textTransform: "none",
                                                background: "linear-gradient(90deg,#7B61FF,#FF7BAC)",
                                                boxShadow: "0 10px 30px rgba(123,97,255,0.12)",
                                            }}
                                        >
                                            {auth.isLoading ? <CircularProgress size={22} color="inherit" /> : "Reset Password"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Snackbar for success / error */}
            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
                <Alert onClose={handleClose} severity={auth.resetPasswordError ? "error" : "success"} sx={{ width: "100%" }}>
                    {auth.resetPasswordError || auth.resetPasswordMessage}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}
