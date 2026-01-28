import * as React from "react";
import { Grid, TextField, Button, Box, Typography, Chip, Fade, Zoom } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../../Redux/Customers/Order/Action";
import { useState } from "react";
import AddressCard from "../AddressCard/AddressCard";
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function DeliveryAddressForm({ handleNext }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");
    const { auth } = useSelector((store) => store);
    const [selectedAddress, setSelectedAdress] = useState(null);

    console.log("auth", auth);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const address = {
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
            streetAddress: data.get("address"),
            city: data.get("city"),
            state: data.get("state"),
            zipCode: data.get("zip"),
            mobile: data.get("phoneNumber"),
        };

        dispatch(createOrder({ address, jwt, navigate }));
        handleNext();
    };

    const handleCreateOrder = (item) => {
        dispatch(createOrder({ address: item, jwt, navigate }));
        handleNext();
    };

    return (
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'flex-start' }}>
            {/* Saved Addresses Section */}
            <Box sx={{ flex: { xs: '1', lg: '0 0 420px' }, width: { xs: '100%', lg: '420px' } }}>
                <Box sx={{
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    border: '1px solid #f3f4f6',
                    height: '600px',
                }}>
                    {/* Header */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
                        px: 3,
                        py: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    }}>
                        <HomeIcon sx={{ color: 'white', fontSize: 28 }} />
                        <Typography sx={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1.125rem'
                        }}>
                            Saved Addresses
                        </Typography>
                        <Chip
                            label={auth.user?.address?.length || 0}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 600,
                                ml: 'auto'
                            }}
                        />
                    </Box>

                    {/* Address List */}
                    <Box sx={{
                        height: 'calc(600px - 70px)',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#9333ea',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#7c3aed',
                        },
                    }}>
                        {auth.user?.address?.length > 0 ? (
                            auth.user.address.map((item, index) => (
                                <Fade in={true} timeout={300 + index * 100} key={item.id}>
                                    <Box
                                        onClick={() => setSelectedAdress(item)}
                                        sx={{
                                            p: 2.5,
                                            borderBottom: '1px solid #f3f4f6',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'all 0.3s ease',
                                            background: selectedAddress?.id === item.id
                                                ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(219, 39, 119, 0.05) 100%)'
                                                : 'transparent',
                                            '&:hover': {
                                                background: selectedAddress?.id === item.id
                                                    ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(219, 39, 119, 0.08) 100%)'
                                                    : 'rgba(147, 51, 234, 0.02)',
                                                transform: 'translateX(4px)',
                                            },
                                            '&:last-child': {
                                                borderBottom: 'none',
                                            }
                                        }}
                                    >
                                        {/* Selection Indicator */}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                        }}>
                                            {selectedAddress?.id === item.id ? (
                                                <CheckCircleIcon sx={{
                                                    color: '#9333ea',
                                                    fontSize: 24,
                                                    filter: 'drop-shadow(0 2px 4px rgba(147, 51, 234, 0.3))'
                                                }} />
                                            ) : (
                                                <RadioButtonUncheckedIcon sx={{
                                                    color: '#d1d5db',
                                                    fontSize: 24
                                                }} />
                                            )}
                                        </Box>

                                        <Box sx={{ pr: 4 }}>
                                            <AddressCard address={item} />
                                        </Box>

                                        {selectedAddress?.id === item.id && (
                                            <Zoom in={true}>
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    endIcon={<ArrowForwardIcon />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCreateOrder(item);
                                                    }}
                                                    sx={{
                                                        mt: 2,
                                                        background: 'linear-gradient(90deg, #9333ea 0%, #db2777 100%)',
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        py: 1.2,
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontSize: '0.95rem',
                                                        width: '100%',
                                                        boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(90deg, #7c3aed 0%, #be185d 100%)',
                                                            boxShadow: '0 6px 20px rgba(147, 51, 234, 0.5)',
                                                            transform: 'translateY(-2px)',
                                                        },
                                                        transition: 'all 0.3s ease',
                                                    }}
                                                >
                                                    Deliver Here
                                                </Button>
                                            </Zoom>
                                        )}
                                    </Box>
                                </Fade>
                            ))
                        ) : (
                            <Box sx={{
                                p: 6,
                                textAlign: 'center',
                                color: '#9ca3af'
                            }}>
                                <HomeIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                                <Typography>No saved addresses yet</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Add New Address Form */}
            <Box sx={{ flex: 1, width: { xs: '100%', lg: 'auto' } }}>
                <Box sx={{
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    border: '1px solid #f3f4f6',
                    overflow: 'hidden',
                    height: '600px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Header */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        px: 3,
                        py: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    }}>
                        <AddIcon sx={{ color: 'white', fontSize: 28 }} />
                        <Typography sx={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1.125rem'
                        }}>
                            Add New Address
                        </Typography>
                    </Box>

                    {/* Form */}
                    <Box sx={{
                        p: 3.5,
                        overflowY: 'auto',
                        flex: 1,
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#8b5cf6',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#7c3aed',
                        },
                    }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="firstName"
                                        name="firstName"
                                        label="First Name"
                                        fullWidth
                                        autoComplete="given-name"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s',
                                                '&:hover fieldset': {
                                                    borderColor: '#9333ea',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#9333ea',
                                                    borderWidth: '2px',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#9333ea',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="lastName"
                                        name="lastName"
                                        label="Last Name"
                                        fullWidth
                                        autoComplete="family-name"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s',
                                                '&:hover fieldset': {
                                                    borderColor: '#9333ea',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#9333ea',
                                                    borderWidth: '2px',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#9333ea',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="address"
                                        name="address"
                                        label="Street Address"
                                        fullWidth
                                        autoComplete="street-address"
                                        multiline
                                        rows={2.5}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s',
                                                '&:hover fieldset': {
                                                    borderColor: '#9333ea',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#9333ea',
                                                    borderWidth: '2px',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#9333ea',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="city"
                                        name="city"
                                        label="City"
                                        fullWidth
                                        autoComplete="address-level2"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s',
                                                '&:hover fieldset': {
                                                    borderColor: '#9333ea',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#9333ea',
                                                    borderWidth: '2px',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#9333ea',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="state"
                                        name="state"
                                        label="State/Province/Region"
                                        fullWidth
                                        autoComplete="address-level1"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s',
                                                '&:hover fieldset': {
                                                    borderColor: '#9333ea',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#9333ea',
                                                    borderWidth: '2px',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#9333ea',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="zip"
                                        name="zip"
                                        label="Zip / Postal Code"
                                        fullWidth
                                        autoComplete="postal-code"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s',
                                                '&:hover fieldset': {
                                                    borderColor: '#9333ea',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#9333ea',
                                                    borderWidth: '2px',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#9333ea',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        label="Phone Number"
                                        fullWidth
                                        autoComplete="tel"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s',
                                                '&:hover fieldset': {
                                                    borderColor: '#9333ea',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#9333ea',
                                                    borderWidth: '2px',
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#9333ea',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            mt: 1.5,
                                            py: 1.5,
                                            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                                            color: 'white',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                                            '&:hover': {
                                                background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
                                                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)',
                                                transform: 'translateY(-2px)',
                                            },
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        Save & Deliver to This Address
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}