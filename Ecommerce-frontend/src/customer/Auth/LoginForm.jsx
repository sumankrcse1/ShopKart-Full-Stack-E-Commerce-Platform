import * as React from "react";
import {
    Grid,
    TextField,
    Button,
    Box,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Typography,
    Divider,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../../Redux/Auth/Action";
import { useEffect, useState, useRef } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export default function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const { auth } = useSelector((store) => store);
    const handleCloseSnakbar = () => setOpenSnackBar(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const redirectedRef = useRef(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    // Check for existing JWT on mount
    useEffect(() => {
        if (jwt && !auth.user && !auth.loading) {
            console.log('🔍 Found existing JWT, fetching user data');
            dispatch(getUser(jwt));
        }
    }, [jwt, dispatch]); // Only run on mount or when jwt changes

    // Handle successful authentication and redirect
    useEffect(() => {
        // Prevent multiple redirects
        if (redirectedRef.current) return;

        if (auth.user && !auth.loading) {
            console.log('✅ User authenticated:', auth.user);
            setOpenSnackBar(true);
            setIsSubmitting(false);
            
            // Mark that we're about to redirect
            redirectedRef.current = true;
            
            setTimeout(() => {
                if (auth.user.role === 'ADMIN') {
                    console.log('🔄 Redirecting to admin dashboard');
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    console.log('🔄 Redirecting to home');
                    navigate("/", { replace: true });
                }
            }, 1000);
        }
        
        if (auth.error) {
            console.error('❌ Auth error:', auth.error);
            setOpenSnackBar(true);
            setIsSubmitting(false);
        }
    }, [auth.user, auth.error, auth.loading, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Prevent double submission
        if (isSubmitting) {
            console.log('⚠️ Already submitting, ignoring');
            return;
        }

        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");

        // Validate inputs
        if (!email || !password) {
            setOpenSnackBar(true);
            return;
        }

        const userData = {
            email: email.trim(),
            password: password,
        };

        console.log('🔐 Submitting login form');
        setIsSubmitting(true);
        
        try {
            await dispatch(login(userData));
        } catch (error) {
            console.error('❌ Login submission error:', error);
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        const frontendUrl = 'http://localhost:3000';
        const redirectUri = encodeURIComponent(`${frontendUrl}/oauth2/redirect`);
        
        const oauthUrl = `${API_BASE_URL}/oauth2/authorize/google?redirect_uri=${redirectUri}`;
        
        console.log('🔍 Initiating OAuth flow...');
        console.log('OAuth URL:', oauthUrl);
        console.log('Redirect URI (decoded):', `${frontendUrl}/oauth2/redirect`);
        
        window.location.href = oauthUrl;
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                zIndex: 1400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(3px)',
                p: 2,
            }}
        >
            <Card
                elevation={20}
                sx={{
                    width: '100%',
                    maxWidth: 520,
                    borderRadius: 2,
                    overflow: 'visible',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,250,250,0.98))',
                    boxShadow: '0 20px 60px rgba(2,6,23,0.45)',
                }}
            >
                <CardContent sx={{ px: { xs: 3, sm: 6 }, py: { xs: 3, sm: 5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <span className="text-2xl font-bold hidden sm:block">
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Shop</span>
                                <span className="text-yellow-300">Kart</span>
                            </span>
                        </Box>
                        <Box sx={{ flex: 1 }} />
                        <Typography variant="caption" color="text.secondary">
                            New here?&nbsp;
                            <Button
                                onClick={() => navigate('/register')}
                                size="small"
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                Create account
                            </Button>
                        </Typography>
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        Welcome back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Sign in to continue to your account and explore exclusive deals.
                    </Typography>

                    {/* Google OAuth Login Button */}
                    <Box sx={{ mb: 3 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            startIcon={<GoogleIcon />}
                            onClick={handleGoogleLogin}
                            disabled={isSubmitting}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                borderColor: 'rgba(0,0,0,0.12)',
                                color: 'text.primary',
                                '&:hover': {
                                    borderColor: '#4285F4',
                                    backgroundColor: 'rgba(66, 133, 244, 0.04)',
                                }
                            }}
                        >
                            Continue with Google
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            Or continue with email
                        </Typography>
                    </Divider>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="email"
                                    name="email"
                                    label="Email address"
                                    fullWidth
                                    autoComplete="email"
                                    size="medium"
                                    variant="outlined"
                                    disabled={isSubmitting}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: 'all 0.25s ease',
                                            '&:hover': { boxShadow: '0 0 0 3px rgba(123,97,255,0.08)' },
                                            '&.Mui-focused': { boxShadow: '0 0 0 6px rgba(123,97,255,0.12)' }
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlinedIcon sx={{ opacity: 0.7 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="password"
                                    name="password"
                                    label="Password"
                                    fullWidth
                                    autoComplete="current-password"
                                    type={showPassword ? 'text' : 'password'}
                                    size="medium"
                                    variant="outlined"
                                    disabled={isSubmitting}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            transition: 'all 0.25s ease',
                                            '&:hover': { boxShadow: '0 0 0 3px rgba(255,122,172,0.08)' },
                                            '&.Mui-focused': { boxShadow: '0 0 0 6px rgba(255,122,172,0.12)' }
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon sx={{ opacity: 0.7 }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    disabled={isSubmitting}
                                                    sx={{ color: 'rgba(0, 0, 0, 0.54)' }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button
                                    onClick={() => navigate('/forgot-password')}
                                    size="small"
                                    disabled={isSubmitting}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                >
                                    Forgot Password?
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={isSubmitting}
                                    sx={{
                                        px: 4,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        background: 'linear-gradient(90deg, #7B61FF 0%, #FF7BAC 100%)',
                                        boxShadow: '0 8px 20px rgba(123,97,255,0.18)',
                                        minWidth: 100,
                                    }}
                                >
                                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            By signing in you agree to our&nbsp;
                            <Button size="small" sx={{ textTransform: 'none' }}>Terms</Button>
                            &nbsp;and&nbsp;
                            <Button size="small" sx={{ textTransform: 'none' }}>Privacy</Button>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnakbar}>
                <Alert onClose={handleCloseSnakbar} severity={auth.error ? "error" : "success"} sx={{ width: '100%' }}>
                    {auth.error ? auth.error : auth.user ? "Login Success!" : ""}
                </Alert>
            </Snackbar>
        </Box>
    );
}