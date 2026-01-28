import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../Redux/Auth/Action';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { auth } = useSelector((store) => store);
    const [isProcessing, setIsProcessing] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        console.log('🔍 OAuth2RedirectHandler - URL Params:', {
            token: token ? 'Present' : 'Missing',
            error: error || 'None',
            fullUrl: window.location.href
        });

        if (error) {
            console.error('❌ OAuth2 Error:', error);
            setErrorMessage('Authentication failed: ' + error);
            setIsProcessing(false);
            setTimeout(() => {
                navigate('/login?error=' + encodeURIComponent(error), { replace: true });
            }, 2000);
            return;
        }

        if (token) {
            console.log('✅ Token received, storing and fetching user data');
            // Store the token
            localStorage.setItem('jwt', token);
            
            // Fetch user data
            dispatch(getUser(token));
        } else {
            console.error('❌ No token or error found in URL');
            setErrorMessage('No authentication token received');
            setIsProcessing(false);
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 2000);
        }
    }, [location, navigate, dispatch]);

    // Wait for user data to be loaded
    useEffect(() => {
        if (auth.user && isProcessing) {
            console.log('✅ User data loaded:', auth.user);
            setIsProcessing(false);
            
            // Redirect based on user role
            setTimeout(() => {
                if (auth.user.role === 'ADMIN') {
                    console.log('🔄 Redirecting to admin dashboard');
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    console.log('🔄 Redirecting to home');
                    navigate('/', { replace: true });
                }
            }, 500);
        }

        if (auth.error && isProcessing) {
            console.error('❌ Auth error:', auth.error);
            setErrorMessage(auth.error);
            setIsProcessing(false);
            setTimeout(() => {
                navigate('/login?error=' + encodeURIComponent(auth.error), { replace: true });
            }, 2000);
        }
    }, [auth.user, auth.error, navigate, isProcessing]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: 3,
            }}
        >
            {errorMessage ? (
                <Alert severity="error" sx={{ maxWidth: 500 }}>
                    {errorMessage}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Redirecting to login...
                    </Typography>
                </Alert>
            ) : (
                <>
                    <CircularProgress 
                        size={60} 
                        sx={{ 
                            color: 'white',
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            }
                        }}
                    />
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
                        Completing sign in...
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        Please wait while we set up your account
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default OAuth2RedirectHandler;