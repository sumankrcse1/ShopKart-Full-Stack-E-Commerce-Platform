import React, { useState, useEffect } from "react";
import {
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
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearPasswordMessages } from "../../Redux/Auth/Action";

export default function ForgotPasswordForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth } = useSelector((store) => store);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [email, setEmail] = useState("");

    const handleClose = () => {
        setOpenSnackBar(false);
        dispatch(clearPasswordMessages());
    };

    useEffect(() => {
        if (auth.forgotPasswordMessage || auth.forgotPasswordError) {
            setOpenSnackBar(true);
        }
    }, [auth.forgotPasswordMessage, auth.forgotPasswordError]);

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(forgotPassword(email));
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    return (
        <>
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
                        <Button
                            onClick={() => navigate('/login')}
                            sx={{ 
                                minWidth: 'auto', 
                                p: 1,
                                color: 'text.secondary',
                                '&:hover': { bgcolor: 'rgba(145, 85, 253, 0.08)' }
                            }}
                        >
                            <ArrowBackIcon />
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                            <span className="text-2xl font-bold hidden sm:block">
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Shop</span>
                                <span className="text-yellow-300">Kart</span>
                            </span>
                        </Box>
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        Forgot Password?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        No worries! Enter your email address and we'll send you a link to reset your password.
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            required
                            id="email"
                            name="email"
                            label="Email address"
                            fullWidth
                            autoComplete="email"
                            type="email"
                            size="medium"
                            variant="outlined"
                            value={email}
                            onChange={handleEmailChange}
                            autoFocus
                            sx={{
                                mb: 3,
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

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={auth.isLoading}
                            sx={{
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(90deg, #7B61FF 0%, #FF7BAC 100%)',
                                boxShadow: '0 8px 20px rgba(123,97,255,0.18)',
                                '&:hover': {
                                    boxShadow: '0 12px 28px rgba(123,97,255,0.25)',
                                },
                                '&.Mui-disabled': {
                                    background: 'linear-gradient(90deg, #7B61FF 0%, #FF7BAC 100%)',
                                    opacity: 0.6,
                                }
                            }}
                        >
                            {auth.isLoading ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Remember your password?&nbsp;
                            <Button 
                                onClick={() => navigate('/login')}
                                size="small" 
                                sx={{ 
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: '#7B61FF'
                                }}
                            >
                                Back to Login
                            </Button>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Snackbar 
                open={openSnackBar} 
                autoHideDuration={6000} 
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={auth.forgotPasswordError ? "error" : "success"}
                    sx={{ 
                        width: '100%',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                >
                    {auth.forgotPasswordError || auth.forgotPasswordMessage}
                </Alert>
            </Snackbar>
        </>
    );
}