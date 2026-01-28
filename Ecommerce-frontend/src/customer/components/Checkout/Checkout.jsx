import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import DeliveryAddressForm from "./DeliveryAddressForm";
import OrderSummary from "./OrderSummary";
import CheckIcon from '@mui/icons-material/Check';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LockIcon from '@mui/icons-material/Lock';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const steps = ["Login", "Delivery Address", "Order Summary", "Payment"];

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(1);
  const [skipped, setSkipped] = React.useState(new Set());
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const step = parseInt(queryParams.get('step')) || 2;
  const navigate = useNavigate();

  console.log("step", step);

  const handleNext = () => {
    let newSkipped = skipped;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    navigate(`/checkout?step=${step + 1}`);
  };

  const handleBack = () => {
    navigate(`/checkout?step=${step - 1}`);
  };

  const handleReset = () => {
    setActiveStep(0);
    navigate(`/checkout?step=1`);
  };

  const handlePayment = () => {
    console.log("handle payment");
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f3ff 0%, #fce7f3 50%, #dbeafe 100%)'
    }}>
      
      <Box className="px-10 lg:px-20 mt-10" sx={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        px: { xs: 2, sm: 3, lg: 10 },
        py: 5 
      }}>
        {/* Classic MUI Stepper */}
        <Box sx={{
          background: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          p: { xs: 3, sm: 4, md: 5 },
          mb: 4,
          border: '1px solid #f3f4f6'
        }}>
          <Stepper 
            activeStep={step - 1}
            sx={{
              '& .MuiStepLabel-root .Mui-completed': {
                color: '#16a34a',
              },
              '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
                color: '#6b7280',
                fontWeight: 500,
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: '#9333ea',
              },
              '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                color: '#111827',
                fontWeight: 600,
              },
              '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                fill: 'white',
              },
              '& .MuiStepConnector-line': {
                borderColor: '#e5e7eb',
              },
              '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                borderColor: '#16a34a',
              },
              '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                borderColor: '#9333ea',
              },
            }}
          >
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel 
                    {...labelProps}
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        mt: 1,
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>

        <Box sx={{ width: "100%" }}>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Box sx={{
                background: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                p: 6,
                textAlign: 'center',
                border: '1px solid #f3f4f6'
              }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  background: '#dcfce7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3
                }}>
                  <CheckIcon sx={{ fontSize: 40, color: '#16a34a' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1 }}>
                  Order Completed!
                </Typography>
                <Typography sx={{ mt: 2, mb: 4, color: '#6b7280' }}>
                  All steps completed - you're finished
                </Typography>
                <Button
                  onClick={handleReset}
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(90deg, #9333ea 0%, #db2777 100%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #7c3aed 0%, #be185d 100%)',
                      boxShadow: '0 8px 24px rgba(147, 51, 234, 0.4)',
                    }
                  }}
                >
                  Start New Order
                </Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* Back Button */}
              {step > 2 && (
                <Button
                  onClick={handleBack}
                  disabled={step === 2}
                  startIcon={<ChevronLeftIcon />}
                  sx={{
                    mb: 3,
                    color: '#9333ea',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      color: '#7c3aed',
                      background: 'rgba(147, 51, 234, 0.05)',
                      transform: 'translateX(-4px)',
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  Back to Previous Step
                </Button>
              )}

              {/* Main Content Area with Animation */}
              <Box sx={{
                animation: 'fadeIn 0.5s ease-out',
                '@keyframes fadeIn': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}>
                {step === 2 ? (
                  <DeliveryAddressForm handleNext={handleNext} />
                ) : (
                  <OrderSummary />
                )}
              </Box>
            </React.Fragment>
          )}
        </Box>

        {/* Trust Badges */}
        <Box sx={{
          mt: 6,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 3
        }}>
          <Box sx={{
            background: 'white',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: '1px solid #f3f4f6',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              background: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 1.5
            }}>
              <CheckIcon sx={{ fontSize: 24, color: '#16a34a' }} />
            </Box>
            <Typography sx={{ fontWeight: 'bold', color: '#111827', mb: 0.5 }}>
              Secure Payment
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
              100% secure transactions
            </Typography>
          </Box>

          <Box sx={{
            background: 'white',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: '1px solid #f3f4f6',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              background: '#dbeafe',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 1.5
            }}>
              <LocalShippingIcon sx={{ fontSize: 24, color: '#2563eb' }} />
            </Box>
            <Typography sx={{ fontWeight: 'bold', color: '#111827', mb: 0.5 }}>
              Fast Delivery
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Delivered to your doorstep
            </Typography>
          </Box>

          <Box sx={{
            background: 'white',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: '1px solid #f3f4f6',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            }
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              background: '#f3e8ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 1.5
            }}>
              <LockIcon sx={{ fontSize: 24, color: '#9333ea' }} />
            </Box>
            <Typography sx={{ fontWeight: 'bold', color: '#111827', mb: 0.5 }}>
              Easy Returns
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
              7-day return policy
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
}